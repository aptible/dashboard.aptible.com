export default {
  "threat_events": [
    {
      "id": "adapt_cyber_attacks_based_on_detailed_surveillance",
      "title": "Adapt cyber attacks based on detailed surveillance.",
      "description": "Adversary adapts behavior in response to surveillance and organizational security measures.",
      "relevance": 3,
      "likelihood_of_occurrence": null,
      "base_impact": 5,
      "vulnerabilities": [
        "server_and_architecture_security_misconfiguration"
      ],
      "threat_sources": [
        "expert_outsider",
        "insider",
        "privileged_insider",
        "established_group",
        "competitor"
      ],
      "predisposing_conditions": [
        "workforce_size"
      ]
    },
    {
      "id": "conduct_attacks_using_unauthorized_ports_protocols_and_services",
      "title": "Conduct attacks using unauthorized ports, protocols and services.",
      "description": "Adversary conducts attacks using ports, protocols, and services for ingress and egress that are not authorized for use by organizations.",
      "relevance": 3,
      "likelihood_of_occurrence": null,
      "base_impact": 7,
      "vulnerabilities": [
        "server_and_architecture_security_misconfiguration"
      ],
      "threat_sources": [
        "expert_outsider",
        "established_group",
        "competitor",
        "novice_outsider",
        "ad_hoc_group"
      ],
      "predisposing_conditions": [
        "iaas_based",
        "paas_based"
      ]
    },
    {
      "id": "violate_isolation_in_multi_tenant_environment",
      "title": "Violate isolation in multi-tenant environment.",
      "description": "Adversary circumvents or defeats isolation mechanisms in a multi-tenant environment (e.g., in a cloud computing environment) to observe, corrupt, or deny service to hosted services and information/data.",
      "relevance": 3,
      "likelihood_of_occurrence": null,
      "base_impact": 8,
      "vulnerabilities": [
        "isolation_breaches"
      ],
      "threat_sources": [
        "expert_outsider"
      ],
      "predisposing_conditions": [
        "iaas_based",
        "paas_based"
      ]
    }
  ],
  "security_controls": [
    {
      "id": "network_monitoring",
      "title": "Network Monitoring",
      "description": "IaaS and PaaS routing layers are designed to detect and mitigate DDoS attacks.",
      "efficacy": 6,
      "status": "implemented"
    },
    {
      "id": "limit_open_ports",
      "title": "Limit Open Ports",
      "description": "Restrict publicly-facing application ports to only those necessary for normal operations. Typically 80 (HTTP), 443 (HTTPS), and a port for machine SSH access.",
      "efficacy": 7,
      "status": "planned"
    },
    {
      "id": "standardized_application_deployment_platform",
      "title": "Standardized Application Deployment Platform",
      "description": "Use Aptible to standardize application deployments. Use known, documented, secure configurations for the application server, web server, and database server.",
      "efficacy": 10,
      "status": "implemented"
    },
    {
      "id": "private_subnet_isolation",
      "title": "Private Subnet Isolation",
      "description": "Production services are isolated within a private subnet, addressable from the public Internet only though a specified gateway.",
      "efficacy": 7,
      "status": "implemented"
    },
    {
      "id": "single_tenancy",
      "title": "Single Tenancy",
      "description": "Aptible customers do not share virtualized host tenancy.",
      "efficacy": 7,
      "status": "implemented"
    }
  ],
  "vulnerabilities": [
    {
      "id": "server_and_architecture_security_misconfiguration",
      "title": "Server and Architecture Security Misconfiguration",
      "description": "Good security requires having a secure configuration defined and deployed for the application server, web server, database server, and platform. Secure settings should be defined, implemented, and maintained, as defaults are often insecure. Additionally, software should be kept up to date.",
      "severity": 10
    },
    {
      "id": "isolation_breaches",
      "title": "Isolation Breaches",
      "description": "In a multi-tenant environment, an isolation breach occurs when the actions of one tenant affect other tenants.",
      "severity": 7
    }
  ],
  "predisposing_conditions": [
    {
      "id": "workforce_size",
      "title": "Workforce Size",
      "description": "We have a workforce of less than 50 employees.",
      "pervasiveness": 10
    },
    {
      "id": "iaas_based",
      "title": "IaaS-based",
      "description": "We deploy our information systems on IaaS providers.",
      "pervasiveness": 10
    },
    {
      "id": "paas_based",
      "title": "PaaS-based",
      "description": "We deploy our information systems through Aptible, a PaaS provider.",
      "pervasiveness": 10
    }
  ],
  "threat_sources": [
    {
      "id": "expert_outsider",
      "title": "Expert Outsider",
      "description": "Expert individuals who opportunistically seek to compromise sensitive data. For example: a professional identity thief.",
      "capability": 10,
      "intent": 5,
      "targeting": 7,
      "range_of_effects": null,
      "adversarial": true
    },
    {
      "id": "insider",
      "title": "Insider",
      "description": "Individuals within our organization who seek to exploit sensitive data.",
      "capability": 8,
      "intent": 6,
      "targeting": 10,
      "range_of_effects": null,
      "adversarial": true
    },
    {
      "id": "privileged_insider",
      "title": "Privileged Insider",
      "description": "Privileged individuals within our organization who seek to exploit sensitive data.",
      "capability": 10,
      "intent": 8,
      "targeting": 10,
      "range_of_effects": null,
      "adversarial": true
    },
    {
      "id": "established_group",
      "title": "Established Group",
      "description": "A formal group of individuals seeking to exploit sensitive data. For example: Organized criminals.",
      "capability": 10,
      "intent": 5,
      "targeting": 7,
      "range_of_effects": null,
      "adversarial": true
    },
    {
      "id": "competitor",
      "title": "Competitor",
      "description": "A business competitor seeking to gain commercial advantage.",
      "capability": 6,
      "intent": 6,
      "targeting": 7,
      "range_of_effects": null,
      "adversarial": true
    },
    {
      "id": "novice_outsider",
      "title": "Novice Outsider",
      "description": "Untrained individuals who opportunistically seek to compromise sensitive data. For example: a \"script-kiddie.\"",
      "capability": 2,
      "intent": 2,
      "targeting": 2,
      "range_of_effects": null,
      "adversarial": true
    },
    {
      "id": "ad_hoc_group",
      "title": "Ad-hoc Group",
      "description": "An informal group of individuals seeking to exploit sensitive data. For example: Anonymous.",
      "capability": 6,
      "intent": 2,
      "targeting": 6,
      "range_of_effects": null,
      "adversarial": true
    }
  ],
  "mitigations": [
    {
      "id": "server_and_architecture_security_misconfiguration_network_monitoring",
      "vulnerability": "server_and_architecture_security_misconfiguration",
      "security_control": "network_monitoring",
      "confidence": 1,
      "efficacy": 6
    },
    {
      "id": "server_and_architecture_security_misconfiguration_limit_open_ports",
      "vulnerability": "server_and_architecture_security_misconfiguration",
      "security_control": "limit_open_ports",
      "confidence": 1,
      "efficacy": 7
    },
    {
      "id": "server_and_architecture_security_misconfiguration_standardized_application_deployment_platform",
      "vulnerability": "server_and_architecture_security_misconfiguration",
      "security_control": "standardized_application_deployment_platform",
      "confidence": 1,
      "efficacy": 10
    },
    {
      "id": "isolation_breaches_standardized_application_deployment_platform",
      "vulnerability": "isolation_breaches",
      "security_control": "standardized_application_deployment_platform",
      "confidence": 1,
      "efficacy": 10
    },
    {
      "id": "isolation_breaches_private_subnet_isolation",
      "vulnerability": "isolation_breaches",
      "security_control": "private_subnet_isolation",
      "confidence": 1,
      "efficacy": 7
    },
    {
      "id": "isolation_breaches_single_tenancy",
      "vulnerability": "isolation_breaches",
      "security_control": "single_tenancy",
      "confidence": 1,
      "efficacy": 7
    }
  ]
};