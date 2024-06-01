package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Repository.DocumentRepository;
import cit.ojtnsync.caps.Repository.UserRepository;
import cit.ojtnsync.caps.Service.RequirementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;

@RestController
@RequestMapping("/file")
@CrossOrigin(origins = "*")
public class FileController {

    @Value("${upload.directory}")
    private String uploadDirectory;

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Autowired
	private RequirementService requirementService;

    public FileController(DocumentRepository documentRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    static class UploadResponse {
        private final String message;
        private final Document document;

        public UploadResponse(String message, Document document) {
            this.message = message;
            this.document = document;
        }

        public String getMessage() {
            return message;
        }

        public Document getDocument() {
            return document;
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> handleFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("requirementId") int requirementId,
            @RequestParam(value = "step", required = false, defaultValue = "0") int step) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponse("Please select a file to upload", null));
        }

        try {
            UserEntity submittedBy = userRepository.findByUserid(userId);
            String fileName = file.getOriginalFilename();
            String fileExt = getFileExtension(fileName);

            Requirement requirement = requirementService.getRequirementById(requirementId);
            // public Document(String comment, String fileName, String extName, String hashedFileName, String status, Requirement requirement, UserEntity submittedBy, Timestamp createdAt) {

            // Save information about the uploaded file into a Document entity
            Document document = new Document(null, fileName, fileExt, null, "Pending", requirement, submittedBy, new Timestamp(System.currentTimeMillis()));
            document.setStep(step);
            document = documentRepository.save(document);

            String hashedFileName = "";
            try {
                // Ensures that the hashed filename is a unique filename to prevent same file name saving
                hashedFileName = hashFilename(fileName+document.getId());
                document.setHashedFileName(hashedFileName);
                documentRepository.save(document);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            
            String filePath = uploadDirectory+File.separator+hashedFileName+"."+fileExt;

            // Save the file to the specified directory
            file.transferTo((new File(filePath)).toPath());

            UploadResponse response = new UploadResponse("File uploaded successfully", document);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new UploadResponse("File upload failed", null));
        }
    }


    @PostMapping("/reupload")
    public ResponseEntity<UploadResponse> handleFileReupload(
            @RequestParam("step") int step,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentId") int documentId,
            @RequestParam("userId") Long userId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponse("Please select a file to upload", null));
        }

        try {
            UserEntity submittedBy = userRepository.findByUserid(userId);
            Document existingDocument = documentRepository.findById(documentId).orElse(null);

            if (existingDocument == null) {
                return ResponseEntity.badRequest().body(new UploadResponse("Document not found", null));
            }

            // Delete the old static file
            String oldFilePath = uploadDirectory + File.separator + existingDocument.getHashedFileName() + "." + existingDocument.getExtName();
            Files.deleteIfExists(Paths.get(oldFilePath));

            // Update information about the existing document
            String fileName = file.getOriginalFilename();
            String fileExt = getFileExtension(fileName);

            existingDocument.setFileName(fileName);
            existingDocument.setExtName(fileExt);
            existingDocument.setSubmittedBy(submittedBy);
            existingDocument.setStatus("Pending");
            existingDocument.setStep(step);

            String hashedFileName = "";
            try {
                // Ensures that the hashed filename is a unique filename to prevent the same file name saving
                hashedFileName = hashFilename(fileName + existingDocument.getId());
                existingDocument.setHashedFileName(hashedFileName);
                documentRepository.save(existingDocument);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }

            String filePath = uploadDirectory + File.separator + hashedFileName + "." + fileExt;

            // Save the updated file to the specified directory
            file.transferTo((new File(filePath)).toPath());

            UploadResponse response = new UploadResponse("File reuploaded successfully", existingDocument);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new UploadResponse("File reupload failed", null));
        }
    }

    @PostMapping("/admin/reupload")
    public ResponseEntity<UploadResponse> handleAdminFileReupload(
            String status,
            int step,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentId") int documentId,
            @RequestParam("userId") Long userId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponse("Please select a file to upload", null));
        }

        try {
            UserEntity submittedBy = userRepository.findByUserid(userId);
            Document existingDocument = documentRepository.findById(documentId).orElse(null);

            if (existingDocument == null) {
                return ResponseEntity.badRequest().body(new UploadResponse("Document not found", null));
            }

            // Delete the old static file
            String oldFilePath = uploadDirectory + File.separator + existingDocument.getHashedFileName() + "." + existingDocument.getExtName();
            Files.deleteIfExists(Paths.get(oldFilePath));

            // Update information about the existing document
            String fileName = file.getOriginalFilename();
            String fileExt = getFileExtension(fileName);

            existingDocument.setFileName(fileName);
            existingDocument.setExtName(fileExt);
            existingDocument.setSubmittedBy(submittedBy);
            existingDocument.setStatus(status);
            existingDocument.setStep(step);

            String hashedFileName = "";
            try {
                // Ensures that the hashed filename is a unique filename to prevent the same file name saving
                hashedFileName = hashFilename(fileName + existingDocument.getId());
                existingDocument.setHashedFileName(hashedFileName);
                documentRepository.save(existingDocument);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }

            String filePath = uploadDirectory + File.separator + hashedFileName + "." + fileExt;

            // Save the updated file to the specified directory
            file.transferTo((new File(filePath)).toPath());

            UploadResponse response = new UploadResponse("File reuploaded successfully", existingDocument);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new UploadResponse("File reupload failed", null));
        }
    }


    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable int documentId) {
        Document document = documentRepository.findById(documentId).orElse(null);

        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        String hashedFileName = document.getHashedFileName();
        String fileExtension = document.getExtName();

        String filePath = uploadDirectory + File.separator + hashedFileName + "." + fileExtension;


        // Create a FileSystemResource from the file path
        Resource fileResource = new FileSystemResource(filePath);

        if (!fileResource.exists()) {
            return ResponseEntity.notFound().build();
        }

        // Set the content type and attachment header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", fileResource.getFilename());

        // Return the file as ResponseEntity
        return ResponseEntity.ok()
                .headers(headers)
                .body(fileResource);
    }


    // Helper method to hash the filename
    private String hashFilename(String filename) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(filename.getBytes());

        StringBuilder hashedFilename = new StringBuilder();
        for (byte b : hashBytes) {
            hashedFilename.append(String.format("%02x", b));
        }

        return hashedFilename.toString();
    }

    // Helper method to extract file extension
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            // No file extension found
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }
}
