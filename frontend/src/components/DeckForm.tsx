import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import LANGUAGES from "../constants";
import type { DeckFormData } from "../validation/deckSchemas";

interface DeckFormProps {
  handleSubmit: UseFormHandleSubmit<DeckFormData>;
  onSubmit: (data: DeckFormData) => void;
  register: UseFormRegister<DeckFormData>;
  errors: FieldErrors<DeckFormData>;
  onClose: () => void;
  buttonLabel: string;
}

export default function DeckForm({
  handleSubmit,
  onSubmit,
  register,
  errors,
  onClose,
  buttonLabel,
}: DeckFormProps) {
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        id="name"
        className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
        placeholder="Deck Name"
        {...register("name")}
      />
      {errors?.name?.message && (
        <p className="text-red-600 text-base">{errors.name.message}</p>
      )}

      <select
        data-testid="source-language"
        id="sourceLng"
        {...register("sourceLng")}
        className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.name} value={lang.name}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>

      <select
        data-testid="target-language"
        id="targetLng"
        {...register("targetLng")}
        className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.name} value={lang.name}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>

      <textarea
        id="description"
        {...register("description")}
        className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
        placeholder="Description"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
