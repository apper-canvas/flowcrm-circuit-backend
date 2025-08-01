import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.activities];
  }

  async getById(id) {
    await this.delay();
    const activity = this.activities.find(a => a.Id === id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async create(activityData) {
    await this.delay();
    const maxId = Math.max(...this.activities.map(a => a.Id), 0);
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      completed: false,
      outcome: null,
      createdAt: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay();
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData,
      Id: id
    };
    
    this.activities[index] = updatedActivity;
    return { ...updatedActivity };
  }

  async delete(id) {
    await this.delay();
    const index = this.activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return true;
  }
}

const activityService = new ActivityService();
export default activityService;