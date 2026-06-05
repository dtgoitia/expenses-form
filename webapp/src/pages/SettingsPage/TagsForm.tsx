import { useEffect, useState } from "react";
import { Label } from "../../components/Label";
import { TextInput } from "../../components/TextInput";
import { App } from "../../domain/app";
import { Tag, TagName } from "../../domain/model";
import { Button } from "../../components/Button";

interface Props {
  app: App;
}

export function TagsForm({ app }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);

  const [draft, setDraft] = useState<TagName | undefined>();

  useEffect(() => {
    const subscription = app.tagManager.change$.subscribe((_) => {
      setTags(app.tagManager.getAll());
    });

    setTags(app.tagManager.getAll());

    return () => {
      return subscription.unsubscribe();
    };
  }, [app]);

  function handleAddition(): void {
    if (draft === undefined) {
      return;
    }

    const name = draft;
    app.tagManager.add(name);

    setDraft(undefined);
  }

  function handleNameChange(userInput: string | undefined): void {
    setDraft(userInput);
  }

  function handleTagUpdate(tag: Tag): void {
    app.tagManager.update({ tag });
  }

  function handleTagDeletion(name: TagName): void {
    app.tagManager.delete(name);
  }

  return (
    <Label htmlFor="tags" text="Tags">
      <div role="tags-form" className="py-2 px-2">
        {tags.length === 0 ? (
          <div>No tags found</div>
        ) : (
          <div role="tag-list" className="flex flex-col gap-2">
            {tags.map((tag) => (
              <ListedTag
                key={`tag-${tag.name}`}
                tag={tag}
                onUpdate={handleTagUpdate}
                onDelete={handleTagDeletion}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pl-2">
        <Label htmlFor="add-tag" text="Add tag">
          <TextInput
            id="add-tag"
            value={draft}
            placeholder={`Name`}
            onChange={handleNameChange}
            className="mt-1"
          />
        </Label>

        <div className="flex justify-end p-2">
          <Button text="Add" onClick={handleAddition} disabled={!draft} />
        </div>
      </div>
    </Label>
  );
}

interface ListedTagProps {
  tag: Tag;
  onUpdate: (tag: Tag) => void;
  onDelete: (name: TagName) => void;
}
function ListedTag({ tag, onUpdate: update, onDelete }: ListedTagProps) {
  function toggleVisibility(): void {
    update({ ...tag, isVisible: !tag.isVisible });
  }

  function handleDeletion(): void {
    onDelete(tag.name);
  }

  return (
    <div className="flex flex-row justify-between items-center gap-3">
      <Button icon={tag.isVisible ? "hidden" : "arrow-left"} onClick={toggleVisibility} />
      <div style={{ opacity: tag.isVisible ? `1` : `0.5` }}>{tag.name}</div>
      <Button icon={"bin"} onClick={handleDeletion} />
    </div>
  );
}
