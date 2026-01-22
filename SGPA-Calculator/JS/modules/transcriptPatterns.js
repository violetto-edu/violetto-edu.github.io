/**
 * Transcript Patterns Module
 * Contains patterns and rules for parsing different university transcript formats
 */

export class TranscriptPatterns {
  /**
   * Get all available transcript patterns
   * @returns {Array} Array of pattern objects
   */
  static getAllPatterns() {
    return [
      this.getVTUPattern(),
      this.getAnnaUniversityPattern(),
      this.getBTechGenericPattern(),
      this.getJNTUPattern(),
      this.getKTUPattern(),
      this.getGenericIndianUniversityPattern()
    ];
  }

  /**
   * VTU (Visvesvaraya Technological University) Pattern
   */
  static getVTUPattern() {
    return {
      name: 'VTU',
      identifiers: ['visvesvaraya technological university', 'vtu', 'belagavi'],
      subjectPattern:
        /([A-Z0-9]{2,4}[A-Z]{2,4}\d{2,4}[A-Z]?)\s+([A-Za-z\s&\-()\/,]{8,80})\s+(\d{1,2})\s+(?:(\d{1,3})|([A-Z][+]?))\s*(?:([A-Z][+]?))?/g,
      semesterPattern: /(?:semester|sem)[:\s]*(\d)/gi,
      gradeMapping: {
        O: 10,
        'A+': 9,
        A: 8,
        'B+': 7,
        B: 6,
        C: 5,
        P: 4,
        F: 0
      },
      creditsPattern: /(\d{1,2})\s*credits?/i,
      studentInfoPatterns: {
        name: /name[:\s]+([a-zA-Z\s]{3,40})/i,
        usn: /usn[:\s]+([a-zA-Z0-9]{10,15})/i,
        branch: /branch[:\s]+([a-zA-Z\s&]{3,50})/i
      }
    };
  }

  /**
   * Anna University Pattern
   */
  static getAnnaUniversityPattern() {
    return {
      name: 'Anna University',
      identifiers: ['anna university', 'chennai', 'autonomous college'],
      subjectPattern:
        /([A-Z]{2,4}\d{4}[A-Z]?)\s+([A-Za-z\s&\-()\/,]{8,80})\s+(\d{1,2})\s+(?:(\d{1,3})|([A-Z][+]?))/g,
      semesterPattern: /(?:semester|sem)[:\s]*(\d)/gi,
      gradeMapping: {
        O: 10,
        'A+': 9,
        A: 8,
        'B+': 7,
        B: 6,
        C: 5,
        D: 4,
        U: 0
      },
      creditsPattern: /(\d{1,2})\s*credits?/i,
      studentInfoPatterns: {
        name: /name[:\s]+([a-zA-Z\s]{3,40})/i,
        registerNo: /reg(?:ister)?\.?\s*no[:\s]+([a-zA-Z0-9]{8,15})/i,
        branch: /(?:branch|course)[:\s]+([a-zA-Z\s&]{3,50})/i
      }
    };
  }

  /**
   * Generic B.Tech Pattern
   */
  static getBTechGenericPattern() {
    return {
      name: 'B.Tech Generic',
      identifiers: ['b.tech', 'bachelor of technology', 'engineering'],
      subjectPattern:
        /([A-Z]{2,4}\d{3,4}[A-Z]?)\s+([A-Za-z\s&\-()\/,]{8,70})\s+(\d{1,2})\s+(?:(\d{1,3})|([A-Z][+]?))/g,
      semesterPattern: /(?:semester|sem)[:\s]*(\d)/gi,
      gradeMapping: {
        'A+': 10,
        A: 9,
        'B+': 8,
        B: 7,
        'C+': 6,
        C: 5,
        D: 4,
        F: 0
      },
      creditsPattern: /(\d{1,2})\s*(?:credits?|cr)/i,
      studentInfoPatterns: {
        name: /(?:student\s+)?name[:\s]+([a-zA-Z\s]{3,40})/i,
        rollNo: /roll\s*no[:\s]+([a-zA-Z0-9]{6,15})/i,
        branch: /(?:branch|dept|department)[:\s]+([a-zA-Z\s&]{3,50})/i
      }
    };
  }

  /**
   * JNTU (Jawaharlal Nehru Technological University) Pattern
   */
  static getJNTUPattern() {
    return {
      name: 'JNTU',
      identifiers: [
        'jntu',
        'jawaharlal nehru technological university',
        'hyderabad',
        'kakinada',
        'anantapur'
      ],
      subjectPattern:
        /([A-Z0-9]{5,8})\s+([A-Za-z\s&\-()\/,]{8,80})\s+(\d{1,2})\s+(?:(\d{1,3})|([A-Z][+]?))/g,
      semesterPattern: /(?:semester|sem)[:\s]*(\d)/gi,
      gradeMapping: {
        O: 10,
        'A+': 9,
        A: 8,
        'B+': 7,
        B: 6,
        C: 5,
        D: 4,
        F: 0
      },
      creditsPattern: /(\d{1,2})\s*credits?/i,
      studentInfoPatterns: {
        name: /name[:\s]+([a-zA-Z\s]{3,40})/i,
        htno: /h\.?t\.?\s*no[:\s]+([a-zA-Z0-9]{8,15})/i,
        branch: /branch[:\s]+([a-zA-Z\s&]{3,50})/i
      }
    };
  }

  /**
   * KTU (Kerala Technological University) Pattern
   */
  static getKTUPattern() {
    return {
      name: 'KTU',
      identifiers: [
        'kerala technological university',
        'ktu',
        'thiruvananthapuram'
      ],
      subjectPattern:
        /([A-Z]{2,3}\d{4})\s+([A-Za-z\s&\-()\/,]{8,80})\s+(\d{1,2})\s+(?:(\d{1,3})|([A-Z][+]?))/g,
      semesterPattern: /(?:semester|sem)[:\s]*(\d)/gi,
      gradeMapping: {
        'A+': 10,
        A: 9,
        'B+': 8,
        B: 7,
        'C+': 6,
        C: 5,
        D: 4,
        F: 0
      },
      creditsPattern: /(\d{1,2})\s*credits?/i,
      studentInfoPatterns: {
        name: /name[:\s]+([a-zA-Z\s]{3,40})/i,
        regNo: /reg(?:istration)?[:\s]+([a-zA-Z0-9]{8,15})/i,
        branch: /(?:branch|programme)[:\s]+([a-zA-Z\s&]{3,50})/i
      }
    };
  }

  /**
   * Generic Indian University Pattern
   */
  static getGenericIndianUniversityPattern() {
    return {
      name: 'Generic Indian University',
      identifiers: [
        'university',
        'college',
        'institute',
        'transcript',
        'marksheet'
      ],
      subjectPattern:
        /([A-Z]{2,4}\d{2,4}[A-Z]?)\s+([A-Za-z\s&\-()\/,]{6,60})\s+(\d{1,2})\s+(?:(\d{1,3})|([A-Z][+]?))/g,
      semesterPattern: /(?:semester|sem|year)[:\s]*(\d)/gi,
      gradeMapping: {
        'A+': 10,
        A: 9,
        'B+': 8,
        B: 7,
        'C+': 6,
        C: 5,
        'D+': 4,
        D: 4,
        F: 0,
        FAIL: 0
      },
      creditsPattern: /(\d{1,2})\s*(?:credits?|cr|units?)/i,
      studentInfoPatterns: {
        name: /(?:student\s+)?name[:\s]+([a-zA-Z\s]{3,40})/i,
        rollNo:
          /(?:roll|reg|registration|student)\s*(?:no|number)[:\s]+([a-zA-Z0-9]{6,20})/i,
        branch:
          /(?:branch|course|programme|department|dept)[:\s]+([a-zA-Z\s&]{3,50})/i
      }
    };
  }

  /**
   * Detect the best matching pattern for given text
   * @param {string} text - Text to analyze
   * @returns {Object|null} Best matching pattern or null
   */
  static detectPattern(text) {
    const patterns = this.getAllPatterns();
    const scores = [];

    for (const pattern of patterns) {
      let score = 0;

      // Check for identifier keywords
      for (const identifier of pattern.identifiers) {
        if (text.toLowerCase().includes(identifier.toLowerCase())) {
          score += 10;
        }
      }

      // Test subject pattern matches
      const matches = [...text.matchAll(pattern.subjectPattern)];
      score += Math.min(matches.length * 2, 20);

      // Check for semester patterns
      const semesterMatches = [...text.matchAll(pattern.semesterPattern)];
      score += Math.min(semesterMatches.length * 5, 15);

      // Check for student info patterns
      for (const [key, infoPattern] of Object.entries(
        pattern.studentInfoPatterns
      )) {
        if (infoPattern.test(text)) {
          score += 3;
        }
      }

      scores.push({ pattern, score });
    }

    // Return the pattern with the highest score
    scores.sort((a, b) => b.score - a.score);

    if (scores.length > 0 && scores[0].score > 10) {
      return scores[0].pattern;
    }

    return null;
  }

  /**
   * Common subject name cleaning patterns
   */
  static getCleaningPatterns() {
    return {
      // Remove common prefixes/suffixes
      prefixesToRemove: [
        /^(?:lab|laboratory|practical|theory|lecture)\s+/i,
        /^(?:introduction\s+to|basics\s+of|fundamentals\s+of)\s+/i
      ],
      suffixesToRemove: [
        /\s+(?:lab|laboratory|practical|theory|lecture)$/i,
        /\s+(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i,
        /\s+(?:1|2|3|4|5|6|7|8|9|10)$/i
      ],
      // Replace patterns
      replacements: [
        { from: /&/g, to: 'and' },
        { from: /\s+/g, to: ' ' },
        { from: /[^\w\s&\-()]/g, to: '' }
      ]
    };
  }

  /**
   * Clean subject name using common patterns
   * @param {string} name - Subject name to clean
   * @returns {string} Cleaned subject name
   */
  static cleanSubjectName(name) {
    let cleaned = name.trim();
    const patterns = this.getCleaningPatterns();

    // Remove prefixes
    for (const prefix of patterns.prefixesToRemove) {
      cleaned = cleaned.replace(prefix, '');
    }

    // Remove suffixes
    for (const suffix of patterns.suffixesToRemove) {
      cleaned = cleaned.replace(suffix, '');
    }

    // Apply replacements
    for (const replacement of patterns.replacements) {
      cleaned = cleaned.replace(replacement.from, replacement.to);
    }

    return cleaned.trim();
  }

  /**
   * Extract semester-wise organization from text
   * @param {string} text - Text to analyze
   * @returns {Object} Semester organization info
   */
  static extractSemesterStructure(text) {
    const semesterPattern = /(?:semester|sem)\s*(\d+)|(?:year|yr)\s*(\d+)/gi;
    const matches = [...text.matchAll(semesterPattern)];

    const semesters = matches
      .map((match) => {
        return parseInt(match[1] || match[2]);
      })
      .filter(Boolean);

    const uniqueSemesters = [...new Set(semesters)].sort((a, b) => a - b);

    return {
      hasSemesters: uniqueSemesters.length > 0,
      semesterCount: uniqueSemesters.length,
      semesters: uniqueSemesters,
      isMultiSemester: uniqueSemesters.length > 1
    };
  }

  /**
   * Validate extracted subject data quality
   * @param {Array} subjects - Array of extracted subjects
   * @param {Object} pattern - Pattern used for extraction
   * @returns {Object} Validation results
   */
  static validateExtractionQuality(subjects, pattern) {
    const validation = {
      isValid: false,
      confidence: 0,
      issues: [],
      suggestions: []
    };

    if (subjects.length === 0) {
      validation.issues.push('No subjects extracted');
      return validation;
    }

    // Check for consistent subject codes
    const codePattern = /^[A-Z]{2,4}\d{2,4}[A-Z]?$/;
    const validCodes = subjects.filter((s) =>
      codePattern.test(s.subject_code)
    ).length;
    const codeScore = validCodes / subjects.length;

    // Check for meaningful subject names
    const validNames = subjects.filter(
      (s) =>
        s.subject_name &&
        s.subject_name.length >= 5 &&
        s.subject_name.length <= 80
    ).length;
    const nameScore = validNames / subjects.length;

    // Check for valid credits
    const validCredits = subjects.filter(
      (s) => s.credits && s.credits >= 1 && s.credits <= 10
    ).length;
    const creditScore = validCredits / subjects.length;

    // Check for marks or grades
    const hasMarksOrGrades = subjects.filter(
      (s) => s.marks !== null || s.grade !== null
    ).length;
    const dataScore = hasMarksOrGrades / subjects.length;

    // Calculate overall confidence
    validation.confidence =
      (codeScore + nameScore + creditScore + dataScore) / 4;

    // Determine if extraction is valid
    validation.isValid = validation.confidence >= 0.6;

    // Add specific issues and suggestions
    if (codeScore < 0.8) {
      validation.issues.push('Inconsistent subject code format');
      validation.suggestions.push(
        'Verify subject codes match university format'
      );
    }

    if (nameScore < 0.8) {
      validation.issues.push('Some subject names may be incomplete');
      validation.suggestions.push('Check for truncated subject names');
    }

    if (creditScore < 0.8) {
      validation.issues.push('Credits may not be extracted correctly');
      validation.suggestions.push('Manually verify credit values');
    }

    if (dataScore < 0.5) {
      validation.issues.push('Missing marks or grades for many subjects');
      validation.suggestions.push('Ensure PDF contains marks/grades data');
    }

    return validation;
  }
}
