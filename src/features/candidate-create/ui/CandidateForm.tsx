import { FormEvent } from "react";
import { ideaCategories } from "../../../entities/candidate/model/constants";
import type { CandidateDraft } from "../../../entities/candidate/model/types";

interface CandidateFormProps {
  draft: CandidateDraft;
  disabled: boolean;
  onDraftChange: (draft: CandidateDraft) => void;
  onSubmit: (event: FormEvent) => void;
}

export function CandidateForm({ draft, disabled, onDraftChange, onSubmit }: CandidateFormProps) {
  return (
    <form className="idea-form" onSubmit={onSubmit}>
      <div>
        <p className="section-label">Новая идея</p>
        <strong>Добавить проект на голосование</strong>
      </div>
      <input
        disabled={disabled}
        value={draft.name}
        onChange={(event) => onDraftChange({ ...draft, name: event.target.value })}
        placeholder="Название идеи"
      />
      <select
        disabled={disabled}
        value={draft.category}
        onChange={(event) => onDraftChange({ ...draft, category: event.target.value })}
      >
        {ideaCategories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <textarea
        disabled={disabled}
        value={draft.description}
        onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
        placeholder="Почему эта идея полезна"
      />
      <button disabled={disabled}>Добавить идею</button>
      {disabled && <p className="hint">Войдите в аккаунт, чтобы добавлять идеи.</p>}
    </form>
  );
}
