import io
import os
from dotenv import load_dotenv

# Guarantee environment variables are loaded here
load_dotenv()
import pdfplumber
import docx
import instructor
from groq import Groq
from schemas import ResumeSchema, JDSchema, InterviewQuestionsSchema

# Initialize Groq with Instructor
client = instructor.from_groq(
    Groq(api_key=os.environ.get("GROQ_API_KEY")),
    mode=instructor.Mode.JSON,
)


async def extract_text_from_pdf(file_bytes: bytes) -> str:
  text = ""
  with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
    for page in pdf.pages:
      page_text = page.extract_text()
      if page_text:
        text += page_text + "\n"
  return text


async def extract_text_from_docx(file_bytes: bytes) -> str:
  doc = docx.Document(io.BytesIO(file_bytes))
  return "\n".join([paragraph.text for paragraph in doc.paragraphs])


async def extract_text(file_bytes: bytes, filename: str) -> str:
  if filename.lower().endswith(".pdf"):
    return await extract_text_from_pdf(file_bytes)
  elif filename.lower().endswith(".docx"):
    return await extract_text_from_docx(file_bytes)
  else:
    try:
      return file_bytes.decode("utf-8")
    except UnicodeDecodeError:
      raise ValueError("Unsupported file format. Please upload PDF, DOCX, or TXT.")


def parse_resume(raw_text: str) -> ResumeSchema:
  prompt = f"""
    Parse the following resume text into a structured format.
    CRITICAL INSTRUCTION FOR SKILLS: Normalize all extracted skills to standard industry terms.
    
    Resume Text:
    {raw_text}
    """

  response = client.chat.completions.create(
      model="openai/gpt-oss-20b",
      response_model=ResumeSchema,
      messages=[{"role": "user", "content": prompt}],
  )
  return response


def parse_jd(raw_text: str) -> JDSchema:
  prompt = f"""
    Parse the following Job Description (JD) text into a structured format.
    Split skills into mandatory and nice-to-have, and normalize them.
    
    Job Description Text:
    {raw_text}
    """

  response = client.chat.completions.create(
      model="openai/gpt-oss-20b",
      response_model=JDSchema,
      messages=[{"role": "user", "content": prompt}],
  )
  return response


def generate_interview_questions(
    matched_skills: list, missing_skills: list, job_title: str
) -> InterviewQuestionsSchema:
  prompt = f"""
    You are an expert technical recruiter and hiring manager for the role of '{job_title}'.
    Based on the candidate's skill comparison, generate a customized set of 5 professional interview questions.
    
    - Candidate's Strengths (Matched Skills): {matched_skills}
    - Candidate's Skill Gaps (Missing Skills): {missing_skills}
    
    Instructions:
    1. Create questions that probe deeper into their matched skills to verify true expertise.
    2. Create questions that address missing skills to evaluate how they approach learning new technologies or handling technical deficits.
    3. Categorize each question and explain its evaluation purpose.
    """

  response = client.chat.completions.create(
      model="openai/gpt-oss-20b",
      response_model=InterviewQuestionsSchema,
      messages=[{"role": "user", "content": prompt}],
      max_tokens=1024,  # <--- Add this line to increase the token ceiling
  )
  return response