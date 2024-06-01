package cit.ojtnsync.caps.Service;

import cit.ojtnsync.caps.Entity.Template;
import cit.ojtnsync.caps.Repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemplateService {

    private final TemplateRepository templateRepository;

    @Autowired
    public TemplateService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public Template getTemplateById(int id) {
        Optional<Template> templateOptional = templateRepository.findById(id);
        return templateOptional.orElse(null);
    }

    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Template createTemplate(Template template) {
        return templateRepository.save(template);
    }

    public Template updateTemplate(int id, Template updatedTemplate) {
        Optional<Template> templateOptional = templateRepository.findById(id);
        if (templateOptional.isPresent()) {
            Template template = templateOptional.get();
            template.setFileName(updatedTemplate.getFileName());
            template.setHashedFileName(updatedTemplate.getHashedFileName());
            template.setStatus(updatedTemplate.getStatus());
            template.setExtName(updatedTemplate.getExtName());
            template.setCreatedBy(updatedTemplate.getCreatedBy());
            template.setCreatedAt(updatedTemplate.getCreatedAt());
            return templateRepository.save(template);
        }
        return null; // or throw an exception if needed
    }

    public void deleteTemplate(int id) {
        templateRepository.deleteById(id);
    }
}
