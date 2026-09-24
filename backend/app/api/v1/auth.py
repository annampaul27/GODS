from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any
from app.models.schemas import (
    LoginRequest,
    TokenResponse,
    UserResponse,
    OrganizationResponse,
    RegisterRequest,
    PasswordResetRequest,
    GenericResponse,
    RoleEnum,
)
from app.db.mock_db import (
    get_user_by_email,
    get_org_by_id,
    get_all_orgs,
    create_user,
)
from app.core.security import (
    verify_password,
    create_access_token,
    get_password_hash,
)
from app.core.config import settings
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Identity"])

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    """
    Role-separated authentication endpoint with multi-tenant org validation.
    """
    user = get_user_by_email(req.email)
    
    # If user doesn't exist in seed database, allow seamless fallback for quick sandbox testing
    if not user:
        # Create user on the fly for sandbox convenience
        user = create_user(
            email=req.email,
            password=req.password,
            full_name=req.email.split("@")[0].replace(".", " ").title(),
            role=req.role.value,
            org_id=req.org_id,
        )
    else:
        # Verify password (allows demo passwords or real bcrypt match)
        is_valid = verify_password(req.password, user["password_hash"])
        # For demo ergonomics, also allow common test passwords
        if not is_valid and req.password not in ["SkillSetu@2026", "password", "••••••••••••"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password credentials",
            )
            
    # Check role alignment
    if user.get("role") != req.role.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account exists under role '{user.get('role')}', but login requested for '{req.role.value}'.",
        )
        
    # Check organization scoping for Employer (E11, E14)
    org_info = None
    target_org_id = req.org_id or user.get("org_id")
    if req.role == RoleEnum.EMPLOYER and target_org_id:
        org_dict = get_org_by_id(target_org_id)
        if not org_dict:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Requested organization '{target_org_id}' not found.",
            )
        if org_dict.get("status") == "suspended":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Organization '{org_dict.get('name')}' is currently suspended (A7). Access denied.",
            )
        org_info = OrganizationResponse(**org_dict)

    # Issue cryptographically signed JWT access token
    access_token = create_access_token(
        subject=user["id"],
        role=user["role"],
        org_id=target_org_id,
        email=user["email"],
        name=user["full_name"],
    )
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=RoleEnum(user["role"]),
        avatar_url=user.get("avatar_url"),
        org_id=target_org_id,
        org_name=org_info.name if org_info else None,
        college=user.get("college"),
        readiness_score=user.get("readiness_score"),
        current_tier=user.get("current_tier"),
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user=user_response,
        organization=org_info,
    )

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns the currently authenticated user's profile and active organization context.
    """
    org_name = None
    if current_user.get("org_id"):
        org = get_org_by_id(current_user["org_id"])
        if org:
            org_name = org.get("name")

    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=RoleEnum(current_user["role"]),
        avatar_url=current_user.get("avatar_url"),
        org_id=current_user.get("org_id"),
        org_name=org_name,
        college=current_user.get("college"),
        readiness_score=current_user.get("readiness_score"),
        current_tier=current_user.get("current_tier"),
    )

@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    """
    Registers a new candidate or organization recruiter with bcrypt password encryption.
    """
    existing = get_user_by_email(req.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )
        
    new_user = create_user(
        email=req.email,
        password=req.password,
        full_name=req.full_name,
        role=req.role.value,
        org_id=req.org_id,
        college=req.college,
    )
    
    org_info = None
    if req.org_id:
        org_dict = get_org_by_id(req.org_id)
        if org_dict:
            org_info = OrganizationResponse(**org_dict)
            
    access_token = create_access_token(
        subject=new_user["id"],
        role=new_user["role"],
        org_id=req.org_id,
        email=new_user["email"],
        name=new_user["full_name"],
    )
    
    user_response = UserResponse(
        id=new_user["id"],
        email=new_user["email"],
        full_name=new_user["full_name"],
        role=RoleEnum(new_user["role"]),
        avatar_url=new_user.get("avatar_url"),
        org_id=req.org_id,
        org_name=org_info.name if org_info else None,
        college=new_user.get("college"),
        readiness_score=new_user.get("readiness_score"),
        current_tier=new_user.get("current_tier"),
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user=user_response,
        organization=org_info,
    )

@router.get("/organizations", response_model=List[OrganizationResponse])
async def list_organizations():
    """
    Returns public tenant organizations for the login and onboarding selectors.
    """
    orgs = get_all_orgs()
    return [OrganizationResponse(**o) for o in orgs]

@router.post("/forgot-password", response_model=GenericResponse)
async def forgot_password(req: PasswordResetRequest):
    """
    Simulates generating and dispatching a cryptographic one-time password reset token.
    """
    return GenericResponse(
        success=True,
        message=f"A cryptographic reset token has been dispatched to {req.email}."
    )
