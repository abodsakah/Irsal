import { render, screen } from "@testing-library/react";
import FileImport from "../components/FileImport";
import { Contact } from "../types";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockOnImport = jest.fn();
const mockOnClose = jest.fn();
const existingContacts: Contact[] = [];

beforeEach(() => {
  jest.clearAllMocks();
});

it("renders import dialog when open", () => {
  render(
    <FileImport
      isOpen={true}
      onClose={mockOnClose}
      onImport={mockOnImport}
      existingContacts={existingContacts}
    />
  );

  expect(screen.getByText(/csvImport.title/)).toBeInTheDocument();
});

it("does not render when closed", () => {
  render(
    <FileImport
      isOpen={false}
      onClose={mockOnClose}
      onImport={mockOnImport}
      existingContacts={existingContacts}
    />
  );

  expect(screen.queryByText(/csvImport.title/)).not.toBeInTheDocument();
});

it("shows instructions", () => {
  render(
    <FileImport
      isOpen={true}
      onClose={mockOnClose}
      onImport={mockOnImport}
      existingContacts={existingContacts}
    />
  );

  expect(screen.getByText(/csvImport.instructions/)).toBeInTheDocument();
  expect(screen.getByText(/csvImport.formatDescription/)).toBeInTheDocument();
});
