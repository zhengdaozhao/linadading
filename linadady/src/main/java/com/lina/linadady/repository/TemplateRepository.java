package com.lina.linadady.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.lina.linadady.model.Template;

@Repository
public interface TemplateRepository extends CrudRepository<Template, String> {
}
