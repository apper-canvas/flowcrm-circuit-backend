import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.contacts];
  }

  async getById(id) {
    await this.delay();
    const contact = this.contacts.find(c => c.Id === id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await this.delay();
    const maxId = Math.max(...this.contacts.map(c => c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay();
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...this.contacts[index],
      ...contactData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    this.contacts[index] = updatedContact;
    return { ...updatedContact };
  }

  async delete(id) {
    await this.delay();
    const index = this.contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
this.contacts.splice(index, 1);
    return true;
  }

  calculateLeadScore(contact, scoringConfig) {
    if (!scoringConfig || !scoringConfig.enabled) {
      return 0;
    }

    const { criteria, weights } = scoringConfig;
    let totalScore = 0;

    // Company size scoring
    const companySize = contact.companySize || 'other';
    const companySizeScore = criteria.companySize[companySize] || 0;
    totalScore += companySizeScore * weights.companySize;

    // Contact type scoring
    const contactType = contact.type || 'lead';
    const contactTypeScore = criteria.contactType[contactType] || 0;
    totalScore += contactTypeScore * weights.contactType;

    // Industry scoring
    const industry = contact.industry || 'other';
    const industryScore = criteria.industry[industry] || criteria.industry.other;
    totalScore += industryScore * weights.industry;

    // Engagement level scoring
    const engagementLevel = contact.engagementLevel || 'low';
    const engagementScore = criteria.engagementLevel[engagementLevel] || 0;
    totalScore += engagementScore * weights.engagementLevel;

    return Math.round(totalScore);
  }

  async updateContactScore(id, scoringConfig) {
    const contact = await this.getById(id);
    const leadScore = this.calculateLeadScore(contact, scoringConfig);
    return await this.update(id, { leadScore });
  }

  async recalculateAllScores(scoringConfig) {
    await this.delay();
    for (let i = 0; i < this.contacts.length; i++) {
      const contact = this.contacts[i];
      const leadScore = this.calculateLeadScore(contact, scoringConfig);
      this.contacts[i] = {
        ...contact,
        leadScore,
        updatedAt: new Date().toISOString()
      };
    }
    return true;
  }
}

const contactService = new ContactService();
export default contactService;