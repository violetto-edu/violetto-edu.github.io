/**
 * PDF Reader Module
 * Handles PDF parsing and subject data extraction from VTU transcripts only
 */

import { NotificationManager } from './notificationManager.js';

export class PDFReader {
  constructor() {
    this.pdfjsLib = null;
    this.currentStudentInfo = null;
    this.initializePDFJS();
  }

  /**
   * Initialize PDF.js library
   */
  async initializePDFJS() {
    try {
      // Load PDF.js from CDN
      if (typeof window.pdfjsLib === 'undefined') {
        const script = document.createElement('script');
        script.src =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          this.pdfjsLib = window.pdfjsLib;
        };
        document.head.appendChild(script);
      } else {
        this.pdfjsLib = window.pdfjsLib;
      }
    } catch (error) {
      NotificationManager.showError('Failed to initialize PDF reader');
    }
  }

  /**
   * Read and parse PDF file
   * @param {File} file - PDF file to read
   * @returns {Promise<Object>} Parsed subject data
   */
  async readPDF(file) {
    try {
      if (!this.pdfjsLib) {
        throw new Error('PDF.js not initialized');
      }

      NotificationManager.showInfo(
        'Processing VTU Provisional Results PDF... Please wait'
      );

      const arrayBuffer = await this.fileToArrayBuffer(file);
      const pdf = await this.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;

      let extractedText = '';

      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        extractedText += pageText + '\n';
      }

      const parsedData = this.parseTranscriptText(extractedText);

      if (parsedData.subjects.length === 0) {
        NotificationManager.showError(
          'Only VTU Provisional Results are supported.'
        );
        return null;
      }

      // Map subjects to JSON data to get accurate credits
      const mappedSubjects = await this.mapSubjectsToJSONData(
        parsedData.subjects
      );

      // Check if mapping was successful
      if (mappedSubjects.length === 0) {
        return null;
      }

      parsedData.subjects = mappedSubjects;

      NotificationManager.showSuccess(
        `Successfully extracted ${parsedData.subjects.length} subjects from VTU Provisional Results PDF.`
      );

      return parsedData;
    } catch (error) {
      if (error.message === 'Only VTU Provisional Results are supported') {
        NotificationManager.showError(
          'Only VTU Provisional Results are supported.'
        );
      } else {
        NotificationManager.showError('Failed to read PDF: ' + error.message);
      }
      return null;
    }
  }

  /**
   * Convert file to array buffer
   * @param {File} file - File to convert
   * @returns {Promise<ArrayBuffer>} Array buffer
   */
  fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse transcript text and extract subject data
   * @param {string} text - Raw text from PDF
   * @returns {Object} Parsed subject data
   */
  parseTranscriptText(text) {
    // Clean and normalize text
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // Check if this is a VTU document
    if (!this.isVTUDocument(cleanText)) {
      throw new Error('Only VTU Provisional Results are supported');
    }

    // Extract VTU-specific data
    const result = this.parseVTUTranscript(cleanText);

    return {
      subjects: result.subjects,
      format: 'VTU',
      studentInfo: result.studentInfo,
      confidence: result.subjects.length > 0 ? 0.9 : 0,
      validation: {
        isValid: result.subjects.length > 0,
        confidence: result.subjects.length > 0 ? 0.9 : 0,
        issues: result.subjects.length === 0 ? ['No subjects found'] : [],
        suggestions: []
      }
    };
  }

  /**
   * Check if document is VTU format
   * @param {string} text - Clean text
   * @returns {boolean} True if VTU document
   */
  isVTUDocument(text) {
    const vtuIdentifiers = [
      'visvesvaraya technological university',
      'vtu',
      'belagavi',
      'karnataka',
      'provisional results'
    ];

    const lowerText = text.toLowerCase();
    return vtuIdentifiers.some((identifier) => lowerText.includes(identifier));
  }

  /**
   * Parse VTU transcript and extract only essential data
   * @param {string} text - Clean text
   * @returns {Object} Parsing result with subjects and student info
   */
  parseVTUTranscript(text) {
    const extractedData = [];
    const studentInfo = {};

    // Extract student information
    const nameMatch = text.match(/student\s+name\s*[:\s]+([a-zA-Z\s]{3,50})/i);
    if (nameMatch) {
      studentInfo.name = nameMatch[1].trim();
    }

    const usnMatch = text.match(
      /university\s+seat\s+number\s*[:\s]+([a-zA-Z0-9]{8,15})/i
    );
    if (usnMatch) {
      studentInfo.usn = usnMatch[1].trim();
    }

    // Store student info for branch detection
    this.currentStudentInfo = studentInfo;

    // Extract semester
    const semesterMatch = text.match(/semester\s*[:\s]*(\d+)/i);
    const semester = semesterMatch ? parseInt(semesterMatch[1]) : 1;

    // VTU pattern: Extract only subject code, marks, and grades
    // Different patterns for different semesters due to different code formats
    // All VTU subject codes must start with 'B' to avoid matching USN parts

    let patterns = [];

    if (semester <= 2) {
      // First and Second Semester Patterns (from one.json and two.json)
      // These have longer prefixes like BMATS, BCHES, BCEDK, BESCK, BETCK, etc.
      patterns = [
        // Pattern for standard first-year subjects: BMATS201, BCHES202, BCEDK203
        /(B[A-Z]{4,5}\d{3})\s+([A-Za-z\s&\-()\/,:.0-9]+?)\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+([A-Z])\s+/g,

        // Pattern for subjects with 'x' suffix: BESCK204x, BETCK205x
        /(B[A-Z]{4,5}\d{3}[A-Z])\s+([A-Za-z\s&\-()\/,:.0-9]+?)\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+([A-Z])\s+/g,

        // Alternative pattern for any missed first-year subjects
        /(B[A-Z]{4,5}\d{3}[A-Z]?)\s+([^0-9]*(?:\d+\.?\d*[^0-9\s])*[^0-9]*?)\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+([A-Z])/g
      ];
    } else {
      // Higher Semester Patterns (from branch-specific JSONs)
      // These have shorter prefixes like BCS, BCG, BCSL, BCGL, etc.
      patterns = [
        // Standard pattern: BCS401, BCG402, BCSL404
        /(B[A-Z]{2,3}L?\d{2,4}[A-Z]?)\s+([A-Za-z\s&\-()\/,:.0-9]+?)\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+([A-Z])\s+/g,

        // Alternative pattern for complex names with decimals
        /(B[A-Z]{2,3}L?\d{2,4}[A-Z]?)\s+([^0-9]*(?:\d+\.?\d*[^0-9\s])*[^0-9]*?)\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+([A-Z])/g,

        // Pattern for ability/skill courses with decimal numbers in names
        /(B[A-Z]{2,3}L?\d{2,4}[A-Z]?)\s+([A-Za-z\s&\-()\/,:.]+?\d+\.?\d*[A-Za-z\s]*?)\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+([A-Z])/g,

        // Pattern for longer prefixes in higher semesters: BBOC407, BUHK408
        /(B[A-Z]{3,4}\d{3}[A-Z]?)\s+([A-Za-z\s&\-()\/,:.0-9]+?)\s+(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s+([A-Z])\s+/g
      ];
    }

    // Helper function to validate if a code is a legitimate VTU subject code
    const isValidVTUSubjectCode = (code) => {
      // Must start with 'B'
      if (!code.startsWith('B')) return false;

      // Must be between 6-9 characters long (extended for first-year subjects)
      if (code.length < 6 || code.length > 9) return false;

      // Should not be a USN branch code pattern (like 4PM22CG023 -> CG023)
      // USN branch codes are exactly 5 chars: 2 letters + 3 digits
      if (code.length === 5 && /^B[A-Z]{2}\d{3}$/.test(code)) return false;

      // Valid VTU subject code patterns based on semester:
      if (semester <= 2) {
        // First and Second Semester patterns:
        // BMATS201, BCHES202, BCEDK203, BESCK204x, BETCK205x, etc.
        const firstYearPatterns = [
          /^B[A-Z]{4,5}\d{3}$/, // BMATS201, BCHES202, BCEDK203
          /^B[A-Z]{4,5}\d{3}[A-Z]$/ // BESCK204x, BETCK205x
        ];
        return firstYearPatterns.some((pattern) => pattern.test(code));
      } else {
        // Higher Semester patterns:
        // BCS401, BCSL305, BCGL456B, BBOC407, BUHK408
        const higherSemPatterns = [
          /^B[A-Z]{2,3}L?\d{3,4}[A-Z]?$/, // Standard pattern: BCS401, BCSL305, BCGL456B
          /^B[A-Z]{3,4}\d{3}[A-Z]?$/ // Longer prefixes: BBOC407, BUHK408
        ];
        return higherSemPatterns.some((pattern) => pattern.test(code));
      }
    };

    // Try all patterns for the current semester
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      pattern.lastIndex = 0; // Reset regex

    let match;
      while ((match = pattern.exec(text)) !== null) {
        const [
          fullMatch,
          code,
          subjectName,
          internal,
          external,
          total,
          result
        ] = match;

        // Validate the extracted code and avoid duplicates
        if (
          isValidVTUSubjectCode(code.trim()) &&
          !extractedData.some((subject) => subject.subject_code === code.trim())
        ) {
      const extractedSubject = {
        subject_code: code.trim(),
        marks: parseInt(total),
            semester: semester
      };

      extractedData.push(extractedSubject);
        }
      }
    }

    return {
      subjects: extractedData,
      studentInfo
    };
  }

  /**
   * Map extracted PDF data to JSON subjects to get complete subject information
   * @param {Array} extractedData - Array of extracted data from PDF
   * @returns {Array} Array of complete subjects with JSON data
   */
  async mapSubjectsToJSONData(extractedData) {
    const mappedSubjects = [];
    const unmatchedSubjects = [];

    for (const extracted of extractedData) {
      const mappedData = await this.findMatchingSubjectInJSON(
        extracted.subject_code,
        extracted.semester
      );

      if (mappedData) {
        // Use JSON data for subject details, PDF data for marks
        const completeSubject = {
          subject_code: mappedData.subject_code,
          subject_name: mappedData.subject_name,
          credits: mappedData.credits,
          semester: mappedData.semester,
          marks: extracted.marks
        };

        // Include max_marks if it exists in the JSON data
        if (mappedData.max_marks) {
          completeSubject.max_marks = mappedData.max_marks;
        }

        mappedSubjects.push(completeSubject);
      } else {
        // Track unmatched subjects but don't create fallbacks
        unmatchedSubjects.push(extracted.subject_code);
      }
    }

    // Show warnings for unmatched subjects
    if (unmatchedSubjects.length > 0) {
      NotificationManager.showWarning(
        `Could not match ${
          unmatchedSubjects.length
        } subjects: ${unmatchedSubjects.join(
          ', '
        )}. These subjects will be skipped.`
      );
    }

    // Ensure we have at least some matched subjects
    if (mappedSubjects.length === 0) {
      NotificationManager.showError(
        'No subjects could be matched with course data. Please ensure you upload a valid VTU provisional result PDF.'
      );
      return [];
    }

    return mappedSubjects;
  }

  /**
   * Extract branch code from VTU USN
   * @param {string} usn - University Seat Number
   * @returns {string|null} Branch code or null if not found
   */
  extractBranchFromUSN(usn) {
    if (!usn || usn.length < 8) {
      return null;
    }

    // USN format: 4PM22CG001
    // Extract the branch part (2 characters before the last 3 digits)
    const branchMatch = usn.match(/\d{2}([A-Z]{2})\d{3}$/);
    if (branchMatch) {
      const branchCode = branchMatch[1];

      // Map VTU branch codes to JSON file names
      const branchMapping = {
        CG: 'csd', // Computer Science & Design
        AI: 'aiml', // Artificial Intelligence & Machine Learning
        CD: 'csds', // Computer Science & Data Science
        CS: 'cse', // Computer Science & Engineering
        CV: 'cv', // Civil Engineering
        ME: 'me', // Mechanical Engineering
        EE: 'eee', // Electrical & Electronics Engineering
        EC: 'ece', // Electronics & Communication Engineering
        IS: 'ise' // Information Science & Engineering
      };

      return branchMapping[branchCode] || null;
    }

    return null;
  }

  /**
   * Find matching subject in JSON data with flexible pattern matching
   * @param {string} code - Subject code from PDF
   * @param {number} semester - Semester number
   * @returns {Object|null} Matched subject data or null
   */
  async findMatchingSubjectInJSON(code, semester) {
    try {
      // Get branch from stored student info
      const branch = this.extractBranchFromUSN(this.currentStudentInfo?.usn);

      // Determine which JSON files to search based on semester and branch
      const filesToSearch = [];

      if (semester <= 2) {
        filesToSearch.push(semester === 1 ? 'data/one.json' : 'data/two.json');
      } else {
        // For higher semesters, use branch-specific file if available
        if (branch) {
          filesToSearch.push(`data/${branch}.json`);
        } else {
          // No fallback - show error and return null
          NotificationManager.showError(
            'Branch not detected from USN. Please ensure you upload a valid VTU provisional result PDF with correct USN format.'
          );
          return null;
        }
      }

      // Search through all relevant files
      for (const jsonFile of filesToSearch) {
        const matchedSubject = await this.searchSubjectInFile(
          jsonFile,
          code,
          semester
        );
        if (matchedSubject) {
          return matchedSubject;
        }
      }

      return null;
    } catch (error) {
      NotificationManager.showError(
        'Failed to match subjects with course data'
      );
      return null;
    }
  }

  /**
   * Search for subject in a specific JSON file with flexible matching
   * @param {string} jsonFile - JSON file path
   * @param {string} code - Subject code from PDF
   * @param {number} semester - Semester number
   * @returns {Object|null} Matched subject or null
   */
  async searchSubjectInFile(jsonFile, code, semester) {
    try {
      const response = await fetch(jsonFile);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        return null;
      }

      // Try different matching strategies
      return this.findBestMatch(data, code, semester);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find best match using multiple matching strategies based on actual VTU patterns
   * @param {Array} subjects - Array of subjects from JSON
   * @param {string} code - Subject code from PDF
   * @param {number} semester - Semester number
   * @returns {Object|null} Best matched subject or null
   */
  findBestMatch(subjects, code, semester) {
    // Filter out subjects with undefined subject_code
    const validSubjects = subjects.filter((s) => s && s.subject_code);

    // Strategy 1: Exact code match
    let match = validSubjects.find(
      (s) => s.subject_code === code && (s.semester == semester || !s.semester)
    );
    if (match) {
      return match;
    }

    // Strategy 2: Handle multi-option subjects (subjects with "/" in JSON)
    match = validSubjects.find(
      (s) =>
        this.matchesMultiOptionSubject(s.subject_code, code) &&
        (s.semester == semester || !s.semester)
    );
    if (match) {
      return match;
    }

    // Strategy 3: Handle wildcard patterns (BXX515x, BXX613x, etc.)
    match = validSubjects.find(
      (s) =>
        this.matchesWildcardPattern(s.subject_code, code) &&
        (s.semester == semester || !s.semester)
    );
    if (match) {
      return match;
    }

    // Strategy 4: Handle lab subjects (subjects ending with L)
    if (this.isLabSubject(code)) {
      match = validSubjects.find(
        (s) =>
          this.matchesLabPattern(s.subject_code, code) &&
          (s.semester == semester || !s.semester)
      );
      if (match) {
        return match;
      }
    }

    // Strategy 5: Handle core subjects with branch prefixes (BMATS, BPHYS, BCHES, etc.)
    match = validSubjects.find(
        (s) =>
        this.matchesCoreSubjectPattern(s.subject_code, code) &&
          (s.semester == semester || !s.semester)
      );
    if (match) {
      return match;
    }

    // Strategy 6: Handle semester-based flexible matching (ignore last character)
    match = validSubjects.find(
      (s) =>
        this.matchesFlexiblePattern(s.subject_code, code) &&
        (s.semester == semester || !s.semester)
    );
    if (match) {
      return match;
    }

    // Strategy 7: Base code matching (first 6 characters for longer codes)
    const baseCode = code.substring(0, Math.min(6, code.length));
    match = validSubjects.find(
      (s) =>
        s.subject_code.startsWith(baseCode) &&
        (s.semester == semester || !s.semester)
    );

    if (match) {
      return match;
    }

    return null;
  }

  /**
   * Check if subject has multiple options separated by "/"
   * @param {string} jsonCode - Code from JSON (may contain "/")
   * @param {string} pdfCode - Code from PDF
   * @returns {boolean} True if matches any option
   */
  matchesMultiOptionSubject(jsonCode, pdfCode) {
    if (!jsonCode || !pdfCode) return false;

    // Handle patterns like "BETCK105x / BPLCK105x" or "BENGK106 / BPWSK106"
    if (jsonCode.includes('/')) {
      const codes = jsonCode.split('/').map((c) => c.trim());
      return codes.some((code) => {
        // Exact match
        if (code === pdfCode) return true;

        // Handle wildcard match (code ends with 'x')
        if (code.endsWith('x')) {
          // For first-year subjects, match the base code structure
          // BETCK105x should match BETCK105A, BETCK105B, etc.
          if (pdfCode.length === code.length) {
            const jsonBase = code.slice(0, -1);
            const pdfBase = pdfCode.slice(0, -1);
            return jsonBase === pdfBase;
          }

          // Also handle cases where PDF might not have suffix
          if (pdfCode.length === code.length - 1) {
            const jsonBase = code.slice(0, -1);
            return jsonBase === pdfCode;
          }
        }

        // Handle base code matching for first-year subjects without 'x'
        // BENGK106 should match variations
        if (code.length >= 7 && pdfCode.length >= 7) {
          const codeBase = code.substring(0, 7);
          const pdfBase = pdfCode.substring(0, 7);
          if (codeBase === pdfBase) return true;
        }

        return false;
      });
    }

    return false;
  }

  /**
   * Check if JSON code with wildcards matches PDF code
   * @param {string} jsonCode - Code from JSON (may contain 'x' or 'X')
   * @param {string} pdfCode - Code from PDF
   * @returns {boolean} True if wildcard pattern matches
   */
  matchesWildcardPattern(jsonCode, pdfCode) {
    if (!jsonCode || !pdfCode) return false;

    // Handle patterns like BXX515x, BXX613x, BXX654x, BXX456x, BXX358x, BXX657x
    if (jsonCode.includes('X') || jsonCode.includes('x')) {
      // For BXX patterns, we need special handling
      if (jsonCode.startsWith('BXX') && jsonCode.endsWith('x')) {
        // Extract the number from JSON (e.g., "456" from "BXX456x")
        const jsonNumber = jsonCode.match(/BXX(\d{3})x/i);
        if (jsonNumber) {
          // Check if PDF code contains the same number and follows the pattern
          const number = jsonNumber[1];

          // PDF should match: B[A-Z]{2,3}L?{number}[A-Z]
          const pdfPattern = new RegExp(`^B[A-Z]{2,3}L?${number}[A-Z]$`, 'i');
          const result = pdfPattern.test(pdfCode);
          if (result) return true;
        }
      }

      // Fallback to general wildcard matching
      let pattern = jsonCode
        .replace(/X/g, '[A-Z0-9]')
        .replace(/x/g, '[A-Z0-9]');

      try {
        const regex = new RegExp(`^${pattern}$`, 'i');
        const result = regex.test(pdfCode);
        if (result) return true;
      } catch (error) {
        return false;
      }
    }

    // Handle ability/skill enhancement courses with specific suffixes
    // This is a fallback for cases not caught by the primary wildcard logic
    if (this.isAbilitySkillEnhancementCourse(pdfCode)) {
      const result = this.matchesAbilitySkillPattern(jsonCode, pdfCode);
      return result;
    }

    return false;
  }

  /**
   * Check if code is an ability or skill enhancement course
   * @param {string} code - Subject code
   * @returns {boolean} True if ability/skill enhancement course
   */
  isAbilitySkillEnhancementCourse(code) {
    if (!code) return false;

    // Pattern: B + 2-3 letters + optional L + 3 digits + letter suffix
    // Examples: BCGL456A, BCG358A, BCGL456B, BCS358C
    const pattern = /^B[A-Z]{2,3}L?\d{3}[A-Z]$/i;
    const hasValidNumbers =
      code.includes('456') ||
      code.includes('358') ||
      code.includes('657') ||
      code.includes('515') ||
      code.includes('613') ||
      code.includes('654');

    const patternMatch = pattern.test(code);

    return patternMatch && hasValidNumbers;
  }

  /**
   * Match ability/skill enhancement pattern with wildcard JSON codes
   * @param {string} jsonCode - Code from JSON (like BXX456x)
   * @param {string} pdfCode - Code from PDF (like BCGL456A)
   * @returns {boolean} True if matches
   */
  matchesAbilitySkillPattern(jsonCode, pdfCode) {
    if (!jsonCode || !pdfCode) return false;

    // Extract the number part from both codes
    const jsonNumber = jsonCode.match(/\d{3}/);
    const pdfNumber = pdfCode.match(/\d{3}/);

    if (!jsonNumber || !pdfNumber) return false;

    // If numbers match, check if it's a valid ability/skill pattern
    if (jsonNumber[0] === pdfNumber[0]) {
      // Check if JSON follows BXX pattern and PDF has the same number
      const jsonPattern = jsonCode.match(/^BXX(\d{3})x$/i);
      const pdfPattern = pdfCode.match(/^B[A-Z]{2,3}L?(\d{3})[A-Z]$/i);

      return jsonPattern && pdfPattern && jsonPattern[1] === pdfPattern[1];
    }

    return false;
  }

  /**
   * Check if code is a lab subject
   * @param {string} code - Subject code
   * @returns {boolean} True if lab subject
   */
  isLabSubject(code) {
    if (!code) return false;

    // Lab subjects typically have 'L' in the code
    // Regular labs: BCSL305, BCGL504, BCGL606
    // Ability/Skill enhancement labs: BCGL456A, BCGL456B
    return (
      code.includes('L') &&
      (/^B[A-Z]*L\d{3,4}$/i.test(code) || // Regular lab pattern
        /^B[A-Z]*L\d{3}[A-Z]$/i.test(code)) // Ability/Skill lab pattern with suffix
    );
  }

  /**
   * Match lab subject patterns
   * @param {string} jsonCode - Code from JSON
   * @param {string} pdfCode - Code from PDF
   * @returns {boolean} True if lab pattern matches
   */
  matchesLabPattern(jsonCode, pdfCode) {
    if (!jsonCode || !pdfCode) return false;

    // Direct match for lab subjects
    if (jsonCode === pdfCode) return true;

    // Handle lab subjects with similar patterns
    if (jsonCode.includes('L') && pdfCode.includes('L')) {
      // Match if the numeric part and general structure are the same
      const jsonMatch = jsonCode.match(/^B([A-Z]*)L(\d{3,4})(.*)$/);
      const pdfMatch = pdfCode.match(/^B([A-Z]*)L(\d{3,4})(.*)$/);

      if (jsonMatch && pdfMatch) {
        // Same number and similar prefix
        return (
          jsonMatch[2] === pdfMatch[2] &&
          jsonMatch[1].length === pdfMatch[1].length
        );
      }
    }

    // Handle ability/skill enhancement lab courses
    // JSON might be BXXxxxL (wildcard) and PDF might be BCGL456A
    if (
      this.isAbilitySkillEnhancementCourse(pdfCode) &&
      pdfCode.includes('L')
    ) {
      return this.matchesAbilitySkillPattern(jsonCode, pdfCode);
    }

    return false;
  }

  /**
   * Match core subjects with standard prefixes
   * @param {string} jsonCode - Code from JSON
   * @param {string} pdfCode - Code from PDF
   * @returns {boolean} True if core subject pattern matches
   */
  matchesCoreSubjectPattern(jsonCode, pdfCode) {
    if (!jsonCode || !pdfCode) return false;

    // Core subjects for first two semesters have standard prefixes
    const coreSubjectPrefixes = [
      'BMATS',
      'BPHYS',
      'BCHES',
      'BPOPS',
      'BCEDK', // Core academic subjects
      'BESCK',
      'BETCK',
      'BPLCK', // Engineering/Technology courses
      'BENGK',
      'BPWSK', // Language courses
      'BKSKK',
      'BKBKK',
      'BICOK', // Kannada/Constitution
      'BIDTK',
      'BSFHK' // Additional courses
    ];

    // Check if both codes start with the same core prefix
    for (const prefix of coreSubjectPrefixes) {
      if (jsonCode.startsWith(prefix) && pdfCode.startsWith(prefix)) {
        // If same prefix, check if the numbers match
        const jsonNumber = jsonCode.match(/\d{3}/);
        const pdfNumber = pdfCode.match(/\d{3}/);

        if (jsonNumber && pdfNumber && jsonNumber[0] === pdfNumber[0]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Enhanced flexible pattern matching for VTU codes
   * @param {string} jsonCode - Code from JSON
   * @param {string} pdfCode - Code from PDF
   * @returns {boolean} True if flexible match
   */
  matchesFlexiblePattern(jsonCode, pdfCode) {
    if (!jsonCode || !pdfCode) return false;

    // Handle variations where PDF might have additional suffix (A, B, C, etc.)
    // This is common for ability/skill enhancement courses
    if (pdfCode.length === jsonCode.length + 1) {
      const basePdfCode = pdfCode.slice(0, -1);
      if (jsonCode === basePdfCode) {
        return true;
      }
    }

    // Handle variations where JSON might have additional suffix
    if (jsonCode.length === pdfCode.length + 1) {
      const baseJsonCode = jsonCode.slice(0, -1);
      if (pdfCode === baseJsonCode) {
        return true;
      }
    }

    // Handle branch code variations (BCS vs BCG vs BCM, etc.)
    // Also handles ability/skill courses: BCG358A vs BCS358C
    if (jsonCode.length === pdfCode.length) {
      const jsonMatch = jsonCode.match(/^B([A-Z]{2,3})(L?)(\d{3,4})(.*)$/);
      const pdfMatch = pdfCode.match(/^B([A-Z]{2,3})(L?)(\d{3,4})(.*)$/);

      if (jsonMatch && pdfMatch) {
        // Same number, lab indicator, and length - different branch prefix might be acceptable
        return (
          jsonMatch[3] === pdfMatch[3] && // Same number
          jsonMatch[2] === pdfMatch[2] && // Same lab indicator (L or empty)
          jsonMatch[1].length === pdfMatch[1].length
        ); // Same prefix length
      }
    }

    return false;
  }

  /**
   * Check if code is a professional elective pattern
   * @param {string} code - Subject code
   * @returns {boolean} True if professional elective
   */
  isProfessionalElective(code) {
    if (!code) return false;
    // Professional electives: BXX515x, BXX613x patterns
    return (
      /^BXX\d{3}x$/i.test(code) || code.includes('515') || code.includes('613')
    );
  }

  /**
   * Check if JSON pattern matches professional elective from PDF
   * @param {string} jsonCode - Code from JSON
   * @param {string} pdfCode - Code from PDF
   * @returns {boolean} True if matches
   */
  matchesProfessionalElectivePattern(jsonCode, pdfCode) {
    return this.matchesWildcardPattern(jsonCode, pdfCode);
  }

  /**
   * Check if code is NSS/PE/Yoga pattern
   * @param {string} code - Subject code
   * @returns {boolean} True if NSS/PE/Yoga pattern
   */
  isNSSPEYogaPattern(code) {
    if (!code) return false;
    return /^B(NSK|PEK|YOK)\d{3}$/i.test(code);
  }

  /**
   * Check if JSON pattern matches NSS/PE/Yoga from PDF
   * @param {string} jsonCode - Code from JSON
   * @param {string} pdfCode - Code from PDF
   * @returns {boolean} True if matches
   */
  matchesNSSPEYogaPattern(jsonCode, pdfCode) {
    return this.matchesMultiOptionSubject(jsonCode, pdfCode);
  }
}
