import { TagName } from "../../domain/model";
import { SyntheticEvent } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";

interface TagProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

function TagComponent({ name, selected, onClick }: TagProps) {
  const customOnClick = (e: SyntheticEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Button size="mini" primary={selected} onClick={customOnClick}>
      {name}
    </Button>
  );
}

const StyledTagContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: flex-start;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
`;

interface TagSelectorProps {
  tags: TagName[];
  selected: Set<TagName>;
  onChange: (tags: Set<TagName>) => void;
}

function TagSelector({ tags, selected, onChange }: TagSelectorProps) {
  function toggleTag(clickedTag: TagName) {
    const updatedTags = new Set<TagName>([...selected.values()]);

    if (selected.has(clickedTag)) {
      updatedTags.delete(clickedTag);
    } else {
      updatedTags.add(clickedTag);
    }

    onChange(updatedTags);
  }

  return (
    <StyledTagContainer>
      {tags.map((tag, i) => (
        <TagComponent
          key={`${tag}-${i}`}
          name={tag}
          selected={selected.has(tag)}
          onClick={() => toggleTag(tag)}
        />
      ))}
    </StyledTagContainer>
  );
}

export default TagSelector;
