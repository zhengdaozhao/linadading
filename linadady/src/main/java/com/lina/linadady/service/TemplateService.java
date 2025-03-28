package com.lina.linadady.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
// import com.lina.linadady.config.RedisConfig;
import org.springframework.stereotype.Service;

import com.lina.linadady.model.Template;
import com.lina.linadady.repository.TemplateRepository;

@Service
public class TemplateService {
    
    @Autowired
    private TemplateRepository templateRepository;
    
    // @Autowired
    // private RedisTemplate<String, Template> redisTemplate;
    
    public List<Template> getAllTemplates() {
        List<Template> templates = new ArrayList<>();
        templateRepository.findAll().forEach(templates::add);
        return templates;
    }
    
    public Template getTemplateById(String id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
    }
    
    public Template saveTemplate(Template template) {
        return templateRepository.save(template);
    }
    
    public void deleteTemplate(String id) {
        templateRepository.deleteById(id);
    }

    public Template updateTemplate(Template updatedTemplate) {
        // Update the template in the database
        updatedTemplate = templateRepository.save(updatedTemplate);
        // Assuming you're using Redis for storage
        // redisTemplate.opsForValue().set(updatedTemplate.getId(), updatedTemplate);
        return updatedTemplate;
    }    
}