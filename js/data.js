{
  "accepts_healthy_volunteers_indicator": {
    "type": "string"
  },
  "acronym": {
    "type": "string"
  },
  "amendment_date": {
    "type": "date"
  },
  "anatomic_sites": {
    "type": "string"
  },
  "arms": {
    "type": "nested",
    "properties": {
      "arm_description": {
        "type": "string"
      },
      "arm_name": {
        "type": "string"
      },
      "arm_type": {
        "type": "string"
      },
      "interventions": {
        "type": "nested",
        "properties": {
          "intervention_description": {
            "type": "string"
          },
          "intervention_name": {
            "type": "string"
          },
          "intervention_code": {
            "type": "string"
          },
          "intervention_type": {
            "type": "string"
          },
          "synonyms": {
            "type": "string"
          }
        }
      }
    }
  },
  "associated_studies": {
    "type": "nested",
    "properties": {
      "study_id": {
        "type": "string"
      },
      "study_id_type": {
        "type": "string"
      }
    }
  },
  "bio_specimen": {
    "type": "nested",
    "properties": {
      "bio_specimen_description": {
        "type": "string"
      },
      "bio_specimen_retention_code": {
        "type": "string"
      },
      "f1": {
        "type": "string"
      },
      "f2": {
        "type": "string"
      },
      "f3": {
        "type": "string"
      },
      "f4": {
        "type": "string"
      }
    }
  },
  "biomarkers": {
    "type": "nested",
    "properties": {
      "assay_purpose": {
        "type": "string"
      },
      "long_name": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "synonyms": {
        "type": "string"
      },
      "hugo_biomarker_code": {
        "type": "string"
      },
      "nci_thesaurus_concept_id": {
        "type": "string"
      }
    }
  },
  "brief_summary": {
    "type": "string"
  },
  "brief_title": {
    "type": "string"
  },
  "ccr_id": {
    "type": "string"
  },
  "central_contact": {
    "type": "nested",
    "properties": {
      "central_contact_email": {
        "type": "string"
      },
      "central_contact_name": {
        "type": "string"
      },
      "central_contact_phone": {
        "type": "string"
      },
      "central_contact_type": {
        "type": "string"
      }
    }
  },
  "classification_code": {
    "type": "string"
  },
  "collaborators": {
    "type": "nested",
    "properties": {
      "functional_role": {
        "type": "string"
      },
      "name": {
        "type": "string",
        "fields": {}
      }
    }
  },
  "completion_date": {
    "type": "date"
  },
  "completion_date_type_code": {
    "type": "string"
  },
  "ctep_id": {
    "type": "string"
  },
  "current_trial_status": {
    "type": "string"
  },
  "current_trial_status_date": {
    "type": "date"
  },
  "dcp_id": {
    "type": "string"
  },
  "detail_description": {
    "type": "string"
  },
  "diseases": {
    "type": "nested",
    "properties": {
      "disease_code": {
        "type": "string"
      },
      "synonyms": {
        "type": "string"
      },
      "display_name": {
        "type": "string"
      },
      "preferred_name": {
        "type": "string"
      },
      "lead_disease_indicator": {
        "type": "string"
      },
      "inclusion_indicator": {
        "type": "string"
      },
      "nci_thesaurus_concept_id": {
        "type": "string"
      },
      "parents": {
        "type": "string"
      }
    }
  },
  "eligibility": {
    "type": "nested",
    "properties": {
      "structured": {
        "type": "nested",
        "properties": {
          "gender": {
            "type": "string"
          },
          "max_age": {
            "type": "string"
          },
          "max_age_in_years": {
            "type": "float"
          },
          "max_age_number": {
            "type": "long"
          },
          "max_age_unit": {
            "type": "string"
          },
          "min_age": {
            "type": "string"
          },
          "min_age_in_years": {
            "type": "float"
          },
          "min_age_number": {
            "type": "long"
          },
          "min_age_unit": {
            "type": "string"
          }
        }
      },
      "unstructured": {
        "type": "nested",
        "properties": {
          "description": {
            "type": "string"
          },
          "inclusion_indicator": {
            "type": "boolean"
          },
          "display_order": {
            "type": "short"
          }
        }
      }
    }
  },
  "interventional_model": {
    "type": "string"
  },
  "keywords": {
    "type": "string"
  },
  "lead_org": {
    "type": "string",
    "fields": {}
  },
  "masking": {
    "type": "nested",
    "properties": {
      "masking": {
        "type": "string"
      },
      "masking_allocation_code": {
        "type": "string"
      },
      "masking_role_caregiver": {
        "type": "string"
      },
      "masking_role_investigator": {
        "type": "string"
      },
      "masking_role_outcome_assessor": {
        "type": "string"
      },
      "masking_role_subject": {
        "type": "string"
      }
    }
  },
  "minimum_target_accrual_number": {
    "type": "long"
  },
  "nci_id": {
    "type": "string"
  },
  "nct_id": {
    "type": "string"
  },
  "number_of_arms": {
    "type": "long"
  },
  "official_title": {
    "type": "string"
  },
  "other_ids": {
    "type": "nested",
    "properties": {
      "name": {
        "type": "string"
      },
      "value": {
        "type": "string"
      }
    }
  },
  "phase": {
    "type": "nested",
    "properties": {
      "phase": {
        "type": "string"
      },
      "phase_additional_qualifier_code": {
        "type": "string"
      },
      "phase_other_text": {
        "type": "string"
      }
    }
  },
  "primary_purpose": {
    "type": "nested",
    "properties": {
      "primary_purpose_additional_qualifier_code": {
        "type": "string"
      },
      "primary_purpose_code": {
        "type": "string"
      },
      "primary_purpose_other_text": {
        "type": "string"
      }
    }
  },
  "principal_investigator": {
    "type": "string",
    "fields": {}
  },
  "protocol_id": {
    "type": "string"
  },
  "record_verification_date": {
    "type": "date"
  },
  "sampling_method_code": {
    "type": "string"
  },
  "sites": {
    "type": "nested",
    "properties": {
      "contact_email": {
        "type": "string"
      },
      "contact_name": {
        "type": "string",
        "fields": {}
      },
      "contact_phone": {
        "type": "string"
      },
      "generic_contact": {
        "type": "string"
      },
      "local_site_identifier": {
        "type": "string"
      },
      "program_code": {
        "type": "string"
      },
      "recruitment_status": {
        "type": "string"
      },
      "recruitment_status_date": {
        "type": "date"
      },
      "org_address_line_1": {
        "type": "string"
      },
      "org_address_line_2": {
        "type": "string"
      },
      "org_city": {
        "type": "string",
        "fields": {}
      },
      "org_coordinates": {
        "type": "geo_point"
      },
      "org_country": {
        "type": "string"
      },
      "org_email": {
        "type": "string"
      },
      "org_family": {
        "type": "string"
      },
      "org_fax": {
        "type": "string"
      },
      "org_name": {
        "type": "string",
        "fields": {}
      },
      "org_to_family_relationship": {
        "type": "string"
      },
      "org_phone": {
        "type": "string"
      },
      "org_postal_code": {
        "type": "string"
      },
      "org_state_or_province": {
        "type": "string",
        "fields": {}
      },
      "org_status": {
        "type": "string"
      },
      "org_status_date": {
        "type": "date"
      },
      "org_tty": {
        "type": "string"
      }
    }
  },
  "start_date": {
    "type": "date"
  },
  "start_date_type_code": {
    "type": "string"
  },
  "study_model_code": {
    "type": "string"
  },
  "study_model_other_text": {
    "type": "string"
  },
  "study_population_description": {
    "type": "string"
  },
  "study_protocol_type": {
    "type": "string"
  },
  "study_subtype_code": {
    "type": "string"
  }
}
