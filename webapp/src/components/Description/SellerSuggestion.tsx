import { formatSeller } from "../../domain/expenses";
import { Seller } from "../../domain/model";
import { Button } from "../Button";

interface Props {
  descriptionSeller: Seller;
  onAcceptance: (seller: Seller) => void;
}

export function SellerSuggestion({ descriptionSeller, onAcceptance: update }: Props) {
  if (descriptionSeller === undefined) {
    return null;
  }
  const suggestion = formatSeller(descriptionSeller);

  if (suggestion === descriptionSeller) {
    return null;
  }

  return (
    <div className="m-3 flex flex-col flex-wrap gap-y-3">
      <div className="opacity-70">seller format suggestion:</div>
      <div>{suggestion}</div>
      <div>
        <Button text="Apply suggestion" onClick={() => update(suggestion)} />
      </div>
    </div>
  );
}
