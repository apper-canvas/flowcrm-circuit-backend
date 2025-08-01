import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    profile: {
      name: "Sales Manager",
      email: "sales@company.com",
      phone: "+1 (555) 123-4567",
      company: "Your Company",
      title: "Sales Director"
    },
    pipeline: {
      stages: [
        { name: "Lead", color: "#F59E0B" },
        { name: "Qualified", color: "#3B82F6" },
        { name: "Proposal", color: "#7C3AED" },
        { name: "Negotiation", color: "#F97316" },
        { name: "Closed Won", color: "#10B981" },
        { name: "Closed Lost", color: "#EF4444" }
      ],
      defaultValue: 1000,
      reminderDays: 3
    },
    notifications: {
      emailNotifications: true,
      taskReminders: true,
      dealUpdates: true,
      dailyDigest: false
    },
    preferences: {
      theme: "light",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
      timezone: "America/New_York"
    }
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "pipeline", label: "Pipeline", icon: "GitBranch" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "preferences", label: "Preferences", icon: "Settings" }
  ];

  const handleSave = (section) => {
    toast.success(`${section} settings saved successfully!`);
  };

  const handleAddStage = () => {
    const newStage = {
      name: "New Stage",
      color: "#6B7280"
    };
    setSettings(prev => ({
      ...prev,
      pipeline: {
        ...prev.pipeline,
        stages: [...prev.pipeline.stages, newStage]
      }
    }));
  };

  const handleRemoveStage = (index) => {
    if (settings.pipeline.stages.length <= 2) {
      toast.error("Pipeline must have at least 2 stages");
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      pipeline: {
        ...prev.pipeline,
        stages: prev.pipeline.stages.filter((_, i) => i !== index)
      }
    }));
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateStage = (index, field, value) => {
    setSettings(prev => ({
      ...prev,
      pipeline: {
        ...prev.pipeline,
        stages: prev.pipeline.stages.map((stage, i) => 
          i === index ? { ...stage, [field]: value } : stage
        )
      }
    }));
  };

  const renderProfileTab = () => (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{settings.profile.name}</h2>
            <p className="text-gray-600">{settings.profile.title}</p>
            <Button variant="outline" size="sm" className="mt-2">
              Change Photo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={settings.profile.name}
            onChange={(e) => updateSetting("profile", "name", e.target.value)}
          />
          <Input
            label="Job Title"
            value={settings.profile.title}
            onChange={(e) => updateSetting("profile", "title", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={settings.profile.email}
            onChange={(e) => updateSetting("profile", "email", e.target.value)}
          />
          <Input
            label="Phone"
            value={settings.profile.phone}
            onChange={(e) => updateSetting("profile", "phone", e.target.value)}
          />
          <Input
            label="Company"
            value={settings.profile.company}
            onChange={(e) => updateSetting("profile", "company", e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSave("Profile")}>
            Save Profile
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderPipelineTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pipeline Stages</h3>
          <Button onClick={handleAddStage} icon="Plus" size="sm">
            Add Stage
          </Button>
        </div>

        <div className="space-y-4">
          {settings.pipeline.stages.map((stage, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <Input
                  value={stage.name}
                  onChange={(e) => updateStage(index, "name", e.target.value)}
                  className="flex-1"
                />
                <input
                  type="color"
                  value={stage.color}
                  onChange={(e) => updateStage(index, "color", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveStage(index)}
                className="text-red-600 hover:text-red-700"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Default Deal Value"
            type="number"
            value={settings.pipeline.defaultValue}
            onChange={(e) => updateSetting("pipeline", "defaultValue", parseInt(e.target.value))}
          />
          <Input
            label="Reminder Days Before Due Date"
            type="number"
            value={settings.pipeline.reminderDays}
            onChange={(e) => updateSetting("pipeline", "reminderDays", parseInt(e.target.value))}
          />
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={() => handleSave("Pipeline")}>
            Save Pipeline Settings
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
      
      <div className="space-y-6">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </h4>
              <p className="text-sm text-gray-500">
                {key === "emailNotifications" && "Receive email notifications for important updates"}
                {key === "taskReminders" && "Get reminders for upcoming tasks and activities"}
                {key === "dealUpdates" && "Notifications when deals change stages or status"}
                {key === "dailyDigest" && "Daily summary of activities and pipeline updates"}
              </p>
            </div>
            <button
              onClick={() => updateSetting("notifications", key, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={() => handleSave("Notifications")}>
          Save Notification Settings
        </Button>
      </div>
    </Card>
  );

  const renderPreferencesTab = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">System Preferences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Theme"
          value={settings.preferences.theme}
          onChange={(e) => updateSetting("preferences", "theme", e.target.value)}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" }
          ]}
        />
        
        <Select
          label="Date Format"
          value={settings.preferences.dateFormat}
          onChange={(e) => updateSetting("preferences", "dateFormat", e.target.value)}
          options={[
            { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
            { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
            { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }
          ]}
        />
        
        <Select
          label="Currency"
          value={settings.preferences.currency}
          onChange={(e) => updateSetting("preferences", "currency", e.target.value)}
          options={[
            { value: "USD", label: "US Dollar (USD)" },
            { value: "EUR", label: "Euro (EUR)" },
            { value: "GBP", label: "British Pound (GBP)" },
            { value: "CAD", label: "Canadian Dollar (CAD)" }
          ]}
        />
        
        <Select
          label="Timezone"
          value={settings.preferences.timezone}
          onChange={(e) => updateSetting("preferences", "timezone", e.target.value)}
          options={[
            { value: "America/New_York", label: "Eastern Time" },
            { value: "America/Chicago", label: "Central Time" },
            { value: "America/Denver", label: "Mountain Time" },
            { value: "America/Los_Angeles", label: "Pacific Time" }
          ]}
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={() => handleSave("Preferences")}>
          Save Preferences
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your profile, pipeline, and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "pipeline" && renderPipelineTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
        {activeTab === "preferences" && renderPreferencesTab()}
      </motion.div>

      {/* Help Section */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="HelpCircle" size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you have questions about any of these settings or need assistance with your CRM configuration, 
              our support team is here to help.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" icon="Book">
                Documentation
              </Button>
              <Button variant="outline" size="sm" icon="MessageCircle">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;