import { Contact, Campaign, TwilioConfig } from "../types";

describe("Contact", () => {
  it("should create a valid contact with all fields", () => {
    const contact: Contact = {
      id: "1",
      firstName: "Ahmed",
      lastName: "Abdullah",
      socialNumber: "601015-1234",
      address: "Storgatan 10",
      postalCode: "12345",
      city: "Stockholm",
      phone: "+46701234567",
      notes: "Test contact",
      addedDate: "2024-01-15",
    };

    expect(contact).toBeDefined();
    expect(contact.firstName).toBe("Ahmed");
    expect(contact.lastName).toBe("Abdullah");
    expect(contact.phone).toBe("+46701234567");
  });

  it("should create a valid contact with only required fields", () => {
    const contact: Contact = {
      id: "2",
      firstName: "Fatima",
      lastName: "Hassan",
      phone: "+46739876543",
      addedDate: "2024-01-16",
    };

    expect(contact).toBeDefined();
    expect(contact.socialNumber).toBeUndefined();
    expect(contact.address).toBeUndefined();
    expect(contact.notes).toBeUndefined();
  });
});

describe("Campaign", () => {
  it("should create a valid campaign", () => {
    const campaign: Campaign = {
      id: "1",
      title: "Friday Prayer Reminder",
      message: "Assalamu alaikum! Prayer at 1:30 PM today.",
      status: "draft",
      sentCount: 0,
      totalCount: 45,
      createdDate: "2024-01-15",
    };

    expect(campaign).toBeDefined();
    expect(campaign.status).toBe("draft");
    expect(campaign.sentCount).toBe(0);
  });

  it("should accept valid status values", () => {
    const statuses: Campaign["status"][] = ["draft", "scheduled", "sent", "failed"];

    statuses.forEach((status) => {
      const campaign: Campaign = {
        id: "1",
        title: "Test",
        message: "Test message",
        status,
        sentCount: 0,
        totalCount: 1,
        createdDate: "2024-01-15",
      };

      expect(campaign.status).toBe(status);
    });
  });
});

describe("TwilioConfig", () => {
  it("should create a valid Twilio configuration", () => {
    const config: TwilioConfig = {
      accountSid: "ACtest123",
      authToken: "test_token",
      phoneNumber: "+46701234567",
      isConfigured: true,
    };

    expect(config).toBeDefined();
    expect(config.isConfigured).toBe(true);
  });
});
