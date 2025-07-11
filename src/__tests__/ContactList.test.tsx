import { render, screen, fireEvent } from "@testing-library/react";
import ContactList from "../components/ContactList";
import { Contact } from "../types";

const mockContacts: Contact[] = [
  {
    id: "1",
    firstName: "Ahmed",
    lastName: "Abdullah",
    phone: "+46701234567",
    notes: "Test contact",
    addedDate: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Fatima",
    lastName: "Hassan",
    phone: "+46739876543",
    addedDate: "2024-01-16",
  },
];

const mockOnEditContact = jest.fn();
const mockOnDeleteContact = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

it("renders contact list with contacts", () => {
  render(
    <ContactList
      contacts={mockContacts}
      onEditContact={mockOnEditContact}
      onDeleteContact={mockOnDeleteContact}
    />
  );

  expect(screen.getByText("Ahmed Abdullah")).toBeInTheDocument();
  expect(screen.getByText("Fatima Hassan")).toBeInTheDocument();
  expect(screen.getByText("+46701234567")).toBeInTheDocument();
  expect(screen.getByText("+46739876543")).toBeInTheDocument();
});

it("displays notes when available", () => {
  render(
    <ContactList
      contacts={mockContacts}
      onEditContact={mockOnEditContact}
      onDeleteContact={mockOnDeleteContact}
    />
  );

  expect(screen.getByText("Test contact")).toBeInTheDocument();
});

it("shows empty state when no contacts", () => {
  render(
    <ContactList
      contacts={[]}
      onEditContact={mockOnEditContact}
      onDeleteContact={mockOnDeleteContact}
    />
  );

  expect(screen.getByText("contacts.noContacts")).toBeInTheDocument();
  expect(screen.getByText("contacts.noContactsDesc")).toBeInTheDocument();
});

it("calls onEditContact when edit button is clicked", () => {
  render(
    <ContactList
      contacts={mockContacts}
      onEditContact={mockOnEditContact}
      onDeleteContact={mockOnDeleteContact}
    />
  );

  const editButtons = screen.getAllByText("contacts.edit");
  fireEvent.click(editButtons[0]);

  expect(mockOnEditContact).toHaveBeenCalledWith(mockContacts[0]);
});

it("calls onDeleteContact when delete button is clicked", () => {
  render(
    <ContactList
      contacts={mockContacts}
      onEditContact={mockOnEditContact}
      onDeleteContact={mockOnDeleteContact}
    />
  );

  const deleteButtons = screen.getAllByText("contacts.delete");
  fireEvent.click(deleteButtons[0]);

  expect(mockOnDeleteContact).toHaveBeenCalledWith("1");
});

it("formats dates correctly", () => {
  render(
    <ContactList
      contacts={mockContacts}
      onEditContact={mockOnEditContact}
      onDeleteContact={mockOnDeleteContact}
    />
  );

  // Check that dates are rendered (format may vary based on locale)
  expect(screen.getAllByText(/2024/)).toHaveLength(2);
});
