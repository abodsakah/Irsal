import { render, screen } from "@testing-library/react";
import ContactForm from "../components/ContactForm";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockOnSave = jest.fn();
const mockOnClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

it("renders when open", () => {
  render(<ContactForm isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

  expect(screen.getByText(/contactForm.addTitle/)).toBeInTheDocument();
});

it("does not render when closed", () => {
  render(<ContactForm isOpen={false} onSave={mockOnSave} onClose={mockOnClose} />);

  expect(screen.queryByText(/contactForm.addTitle/)).not.toBeInTheDocument();
});

it("renders form fields", () => {
  render(<ContactForm isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

  expect(screen.getByText(/contactForm.firstName/)).toBeInTheDocument();
  expect(screen.getByText(/contactForm.lastName/)).toBeInTheDocument();
  expect(screen.getByText(/contactForm.phone/)).toBeInTheDocument();
});
