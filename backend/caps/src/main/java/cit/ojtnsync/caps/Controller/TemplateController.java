package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Template;
import cit.ojtnsync.caps.Service.AdminService;
import cit.ojtnsync.caps.Service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/templates")
public class TemplateController {

    @Value("${upload.directory}")
    private String uploadDirectory;

    private final TemplateService templateService;
    private final AdminService adminService;

    @Autowired
    public TemplateController(TemplateService templateService, AdminService adminService) {
        this.templateService = templateService;
        this.adminService = adminService;
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> handleFileUpload(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @RequestParam("adminid") long adminid) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponse("Please select a file to upload", null));
        }

        try {
            AdminEntity createdBy = adminService.findById(adminid);
            String fileName = file.getOriginalFilename();
            String fileExt = getFileExtension(fileName);

            // Save information about the uploaded file into a Document entity
            Template template = new Template(title, fileName, null, "Active", fileExt, createdBy, new Timestamp(System.currentTimeMillis()));
            template = templateService.createTemplate(template);

            String hashedFileName = "";
            try {
                // Ensures that the hashed filename is a unique filename to prevent same file name saving
                hashedFileName = hashFilename(fileName+template.getId());
                template.setHashedFileName(hashedFileName);
                templateService.createTemplate(template);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            
            String filePath = uploadDirectory+File.separator+hashedFileName+"."+fileExt;

            // Save the file to the specified directory
            file.transferTo((new File(filePath)).toPath());

            UploadResponse response = new UploadResponse("File uploaded successfully", template);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new UploadResponse("File upload failed", null));
        }
    }

    @GetMapping("/download/{templateId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable int templateId) {
        Template template = templateService.getTemplateById(templateId);

        if (template == null) {
            return ResponseEntity.notFound().build();
        }

        String hashedFileName = template.getHashedFileName();
        String fileExtension = template.getExtName();

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

    @GetMapping("/{id}")
    public ResponseEntity<Template> getTemplateById(@PathVariable int id) {
        Template template = templateService.getTemplateById(id);
        return ResponseEntity.ok(template);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Template>> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }

    @PostMapping("/create")
    public ResponseEntity<Template> createTemplate(@RequestBody Template template) {
        Template createdTemplate = templateService.createTemplate(template);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Template> updateTemplate(@PathVariable int id, @RequestBody Template updatedTemplate) {
        Template template = templateService.updateTemplate(id, updatedTemplate);
        return ResponseEntity.ok(template);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable int id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
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

    static class UploadResponse {
        private final String message;
        private final Template template;

        public UploadResponse(String message, Template template) {
            this.message = message;
            this.template = template;
        }

        public String getMessage() {
            return message;
        }

        public Template gTemplate() {
            return template;
        }
    }
}
