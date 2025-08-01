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
}

const contactService = new ContactService();
export default contactService;