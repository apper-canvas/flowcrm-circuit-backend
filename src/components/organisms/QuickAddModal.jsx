import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";

const QuickAddModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [loading, setLoading] = useState(false);
  
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "lead",
    notes: ""
  });

  const [dealForm, setDealForm] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "Lead",
    expectedCloseDate: "",
    notes: ""
  });

  const [activityForm, setActivityForm] = useState({
    type: "call",
    title: "",
    description: "",
    dueDate: "",
    contactId: ""
  });

  const tabs = [
    { id: "contact", label: "Contact", icon: "User" },
    { id: "deal", label: "Deal", icon: "DollarSign" },
    { id: "activity", label: "Activity", icon: "Calendar" }
  ];

  const resetForms = () => {
    setContactForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      type: "lead",
      notes: ""
    });
    setDealForm({
      title: "",
      contactId: "",
      value: "",
      stage: "Lead",
      expectedCloseDate: "",
      notes: ""
    });
    setActivityForm({
      type: "call",
      title: "",
      description: "",
      dueDate: "",
      contactId: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "contact") {
        await contactService.create(contactForm);
        toast.success("Contact created successfully!");
      } else if (activeTab === "deal") {
        await dealService.create({
          ...dealForm,
          value: parseFloat(dealForm.value) || 0
        });
        toast.success("Deal created successfully!");
      } else if (activeTab === "activity") {
        await activityService.create(activityForm);
        toast.success("Activity created successfully!");
      }
      
      resetForms();
      onClose();
onClose();
      
      // Trigger page refresh by dispatching a custom event
      window.dispatchEvent(new window.CustomEvent("dataUpdated"));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderContactForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={contactForm.name}
          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
          required
        />
        <Input
          label="Company"
          value={contactForm.company}
          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={contactForm.email}
          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
        />
        <Input
          label="Phone"
          value={contactForm.phone}
          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
        />
      </div>
      
      <Select
        label="Type"
        value={contactForm.type}
        onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
        options={[
          { value: "lead", label: "Lead" },
          { value: "customer", label: "Customer" },
          { value: "partner", label: "Partner" }
        ]}
      />
      
      <Textarea
        label="Notes"
        value={contactForm.notes}
        onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
        rows={3}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Contact
        </Button>
      </div>
    </form>
  );

  const renderDealForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Deal Title"
        value={dealForm.title}
        onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Deal Value"
          type="number"
          value={dealForm.value}
          onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
          placeholder="0.00"
        />
        <Select
          label="Stage"
          value={dealForm.stage}
          onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
          options={[
            { value: "Lead", label: "Lead" },
            { value: "Qualified", label: "Qualified" },
            { value: "Proposal", label: "Proposal" },
            { value: "Negotiation", label: "Negotiation" },
            { value: "Closed Won", label: "Closed Won" },
            { value: "Closed Lost", label: "Closed Lost" }
          ]}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Contact ID"
          value={dealForm.contactId}
          onChange={(e) => setDealForm({ ...dealForm, contactId: e.target.value })}
          placeholder="Contact ID"
        />
        <Input
          label="Expected Close Date"
          type="date"
          value={dealForm.expectedCloseDate}
          onChange={(e) => setDealForm({ ...dealForm, expectedCloseDate: e.target.value })}
        />
      </div>
      
      <Textarea
        label="Notes"
        value={dealForm.notes}
        onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
        rows={3}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Deal
        </Button>
      </div>
    </form>
  );

  const renderActivityForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Activity Type"
          value={activityForm.type}
          onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
          options={[
            { value: "call", label: "Call" },
            { value: "meeting", label: "Meeting" },
            { value: "task", label: "Task" },
            { value: "email", label: "Email" }
          ]}
        />
        <Input
          label="Contact ID"
          value={activityForm.contactId}
          onChange={(e) => setActivityForm({ ...activityForm, contactId: e.target.value })}
          placeholder="Contact ID"
        />
      </div>
      
      <Input
        label="Activity Title"
        value={activityForm.title}
        onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
        required
      />
      
      <Input
        label="Due Date"
        type="datetime-local"
        value={activityForm.dueDate}
        onChange={(e) => setActivityForm({ ...activityForm, dueDate: e.target.value })}
      />
      
      <Textarea
        label="Description"
        value={activityForm.description}
        onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
        rows={3}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Activity
        </Button>
      </div>
    </form>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Quick Add</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-4 mt-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <ApperIcon name={tab.icon} size={16} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
                {activeTab === "contact" && renderContactForm()}
                {activeTab === "deal" && renderDealForm()}
                {activeTab === "activity" && renderActivityForm()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;