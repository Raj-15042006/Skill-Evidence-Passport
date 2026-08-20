import os
import pytest
from app.pipeline.extract import extract_text, extract_from_docx, extract_from_pdf, extract_from_image

FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")


def test_extract_plain_text():
    sample_text = "Implemented FastAPI application with pytest unit testing suite."
    res = extract_text(sample_text)
    assert res.text == sample_text
    assert res.low_confidence_extraction is False
    assert res.extraction_method == "plain_text_string"


def test_extract_empty_string():
    res = extract_text("")
    assert res.text == ""
    assert res.low_confidence_extraction is True


def test_extract_file_path_txt():
    txt_path = os.path.join(FIXTURES_DIR, "sample_text.txt")
    if os.path.exists(txt_path):
        res = extract_text(txt_path)
        assert "FastAPI" in res.text
        assert res.low_confidence_extraction is False


def test_extract_file_path_docx():
    docx_path = os.path.join(FIXTURES_DIR, "sample_project.docx")
    if os.path.exists(docx_path):
        res = extract_text(docx_path)
        assert "Python" in res.text or "Evidence" in res.text
        assert res.low_confidence_extraction is False


def test_extract_bytes_pdf():
    pdf_path = os.path.join(FIXTURES_DIR, "sample_resume.pdf")
    if os.path.exists(pdf_path):
        with open(pdf_path, "rb") as f:
            data = f.read()
        res = extract_text(data, file_type="pdf")
        assert res.extraction_method == "pdf"


def test_extract_image_low_confidence_fallback():
    # Test OCR fallback handling when given arbitrary unreadable bytes
    raw_img = b"NOT_A_REAL_IMAGE_BYTES"
    res = extract_text(raw_img, file_type="png")
    assert res.low_confidence_extraction is True
