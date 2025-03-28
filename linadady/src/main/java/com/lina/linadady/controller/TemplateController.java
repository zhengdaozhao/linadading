package com.lina.linadady.controller;

import com.lina.linadady.model.Template;
import com.lina.linadady.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    // Get all templates
    @GetMapping
    public ResponseEntity<List<Template>> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }

    // Get template by ID
    @GetMapping("/{id}")
    // public ResponseEntity<Template> getTemplateById(@PathVariable Long id) {
    public ResponseEntity<Template> getTemplateById(@PathVariable String id) {
        Template template = templateService.getTemplateById(id);
        if (template == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(template);
    }

    // Save new template
    @PostMapping
    public ResponseEntity<Template> saveTemplate(@RequestBody Template template) {
        Template savedTemplate = templateService.saveTemplate(template);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTemplate);
    }

    // Update existing template
    @PutMapping("/{id}")
    public ResponseEntity<Template> updateTemplate(@PathVariable String id, @RequestBody Template updatedTemplate) {
        Template template = templateService.getTemplateById(id);
        if (template == null) {
            return ResponseEntity.notFound().build();
        }

        updatedTemplate.setId(id); // Ensure ID is not changed
        Template savedTemplate = templateService.updateTemplate(updatedTemplate);
        return ResponseEntity.ok(savedTemplate);
    }

    // Delete template
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        Template template = templateService.getTemplateById(id);
        if (template == null) {
            return ResponseEntity.notFound().build();
        }

        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }
}