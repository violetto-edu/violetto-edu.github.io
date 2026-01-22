# SGPA Calculator for VTU Students

A modern, intelligent GPA calculator designed specifically for Visvesvaraya Technological University (VTU) students. Features smart PDF parsing capabilities and comprehensive manual calculation interface.

## Quick Start

### Smart Upload Method
1. Visit the calculator landing page
2. Drag and drop your VTU provisional result PDF or click to browse
3. Wait for automatic processing and validation
4. Review extracted subjects and calculate your GPA

### Manual Entry Method
1. Go to the manual calculator page
2. Select your branch and semester
3. Enter subject details manually
4. Calculate SGPA or CGPA

## Features

### PDF Processing
- **VTU Support**: Automatic extraction from VTU provisional result sheets
- **Branch Detection**: Automatically identifies branch from USN format
- **Smart Mapping**: Maps subject codes to comprehensive database for accurate names and credits
- **Multi-Semester**: Handles first year, second year, and higher semester subjects
- **Pattern Matching**: Recognizes various subject code formats including electives and lab subjects
- **Validation**: Strict data validation with confidence scoring

### Manual Calculator
- **All Branches**: CSE, ISE, AI/ML, CSD, CSDS, ECE, EEE, ME, CV
- **SGPA & CGPA**: Calculate semester or cumulative GPA
- **Flexible Input**: Support for both marks and grade points
- **VTU Compliant**: Follows official VTU 2021/22 grading scheme

### User Interface
- **Modern Design**: Clean, responsive interface with dark mode
- **Notifications**: Real-time feedback with ordered notification system
- **Privacy First**: All processing happens locally in your browser
- **Mobile Friendly**: Optimized for all device sizes

## PDF Requirements

### Supported Formats
- VTU provisional result PDFs with machine-readable text
- File size limit: 10MB
- Must contain subject codes, marks, and semester information

### What Gets Extracted
- Subject codes (BCS501, BIS502, etc.)
- Marks (internal, external, total)
- Grades (if available)
- Student information (name, USN, branch)

### Common Issues
- **No data extracted**: Ensure PDF has selectable text, not scanned images
- **Missing subjects**: Check if subjects span multiple pages
- **Low confidence**: Review extracted data carefully before calculation

## Technical Architecture

### Core Components
```
JS/
├── index.js                   # Landing page functionality
├── main.js                    # Manual calculator entry point
└── modules/
    ├── pdfReader.js           # PDF parsing and data extraction
    ├── notificationManager.js # Toast notifications
    ├── themeManager.js        # Dark mode management
    ├── uiManager.js           # UI interactions
    ├── gpaCalculator.js       # GPA calculation logic
    └── other modules...
```

### PDF Processing Workflow
1. **File Upload**: Drag and drop or click-based selection
2. **Validation**: File type, size, and format verification
3. **Text Extraction**: PDF.js-powered parsing
4. **Branch Detection**: USN analysis for automatic routing
5. **Subject Matching**: Pattern-based extraction with database mapping
6. **Validation**: Data quality checks and confidence scoring
7. **Integration**: Automatic redirection with extracted data

### Data Management
- **Branch Mapping**: CG→csd, AI→aiml, CD→csds, CS→cse, etc.
- **Semester Routing**: Semester 1→one.json, Semester 2→two.json, Others→{branch}.json
- **Pattern Recognition**: Multiple regex strategies for different subject formats
- **Validation**: Prevents false matches and ensures data accuracy

## Privacy and Security

### Data Protection
- **No Server Uploads**: All PDF processing happens in your browser
- **No Data Storage**: Academic data never saved or stored anywhere
- **No Analytics**: No tracking or user behavior monitoring
- **Local Only**: Your data never leaves your device

### Technical Implementation
- **Client-Side Processing**: PDF.js library handles documents locally
- **Static Hosting**: No server-side processing or data handling
- **Session Data**: Temporary extraction results cleared when browser closes
- **Open Source**: All code transparent and auditable

## Browser Support

- Chrome 60+ (recommended)
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- Initial load: Under 2 seconds
- PDF processing: 2-10 seconds depending on file size
- Memory optimized for mobile devices
- Maximum file size: 10MB

## Troubleshooting

### PDF Processing Issues
1. **Ensure PDF is text-based**: Test by selecting text in the PDF
2. **Check file size**: Must be under 10MB
3. **Verify format**: Only VTU provisional results supported
4. **Try manual entry**: If PDF processing fails

### Getting Help
- Use manual calculator as fallback
- Check browser console for error messages (F12)
- Ensure PDF follows VTU format standards

## Development

### Architecture Benefits
- **Modular Design**: ES6 modules with single responsibilities
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features and university support
- **Testable**: Isolated components enable comprehensive testing

### Code Organization
- ES6 import/export syntax
- Comprehensive JSDoc documentation
- Consistent error handling patterns
- Modern JavaScript standards

## Future Enhancements

- Support for additional universities
- OCR capabilities for scanned PDFs
- Batch processing for multiple result sheets
- Progressive Web App (PWA) features
- Enhanced mobile experience

---

**Note**: This calculator is designed specifically for VTU students. Always verify extracted data before calculating your GPA to ensure accuracy for important academic decisions.
