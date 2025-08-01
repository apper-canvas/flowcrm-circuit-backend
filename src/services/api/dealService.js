import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async delay(ms = 350) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.deals];
  }

  async getById(id) {
    await this.delay();
    const deal = this.deals.find(d => d.Id === id);
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await this.delay();
    const maxId = Math.max(...this.deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await this.delay();
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const updatedDeal = {
      ...this.deals[index],
      ...dealData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    this.deals[index] = updatedDeal;
    return { ...updatedDeal };
  }

  async delete(id) {
    await this.delay();
    const index = this.deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return true;
  }
}

const dealService = new DealService();
export default dealService;