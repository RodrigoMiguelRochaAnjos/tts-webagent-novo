import { EmailTemplates } from "./products/email-template.model"
import { WebAgent } from "./products/web-agent.model"

export interface AddOns {
    emailTemplates: EmailTemplates;
    WebAgent: WebAgent;
    WebAgentStoreLink: string;
    mailTemplateStoreLink: string;
}
