import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import LANGUAGES from "../constants";
import type { DeckFormData } from "../validation/deckSchemas";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        id="name"
        className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
        placeholder={t("deckName")}
        {...register("name")}
      />
      {errors?.name?.message && (
        <p className="text-red-600 text-base">{t(errors.name.message)}</p>
      )}

      <select
        data-testid="source-language"
        id="sourceLng"
        {...register("sourceLng")}
        className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.name} value={lang.name}>
            {lang.flag} {t(`languagesO.${lang.name}`)}
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
            {lang.flag} {t(`languagesO.${lang.name}`)}
          </option>
        ))}
      </select>

      <textarea
        id="description"
        {...register("description")}
        className="p-2 border-blue-400 border rounded-md focus:outline-2 focus:outline-blue-500 outline-offset-[-1px]"
        placeholder={t("description")}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
        >
          {t("cancel")}
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
