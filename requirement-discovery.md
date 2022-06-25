# requirement_discovery

setDate for expense
setAmount for expense
setPaidWith for expense
setDescription for expense
setPending for expense
setShared for expense

submitExpense (user)
changeExpenseStatus:

- draft: for a new entry, user hits "new" button. There can be multiple expenses in draft mode.
- discarding_draft: deleting draft
- submitting: when a draft is sent to the backend for first time and the request is inflight
- submitted: successful draft/edited submission
- edited: when a submitted expense is changed but not submitted yet
- updating: when an edited expense is sent to the backend and the request is inflight
- deleting: deleting a draft of a submitted expense

submitting and updating are different when it comes to retrying: if submitting fails, there is nothing in the server, if updating fails, there is data in the server. This difference implies that to remove a draft

- draft --> **submitting** --> submitted: if you want to delete a

public setExpenseStatus(expenseId): void

```
                │
                ▼
         ┌────DRAFT──────────────────────────┐
         │      │                            │
     (failed)   │                            │
         │      ▼                            │
         └─►SUBMITTING                       │
                │                            │
                ▼                            ▼
  ┌────────►SUBMITTED───────►DELETING────►(gone)
  │           ▲ │ ▲             │
  │      ┌────┘ │ └──(failed)───┘
  │      │      │
  │  (discard)  │
  │      │      ▼
  │      └───EDITING◄────┐
  │             │        │
  │             │    (failed)
  │             ▼        │
  └──────────UPDATING────┘
```

- Assign unique IDs in the UI:
  - reason: using integer indexes it is possible but very error prone (when sorting, it's easy to introduce a bug and destroy state), just add an ID that will be only used in the UI, to ensure that nothing is fucked up
  - IDs are generated when the expenses are added (either by the user, or fetched from the server)
  - persist IDs to localstorage
    - why:
      - removing the IDs it will add more overhead to clean data when persisting
      - I don't see any benefit to removing IDs
      - I don't see any downside to keeping IDs in localstorage

To generate hashes using built-in functionality (supported in Firefox and Chrome)
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

updating by "focused" es una guarrada...

- con: if many entries focused (like unfolded to be edited), what then?
- problem: I think I went down the wrong path because I was trying to make an API that made very easy to update the "default"/"focused"/"loaded"/"being edited by the user" expense
- there are going to be cases where multiple expenses will be updated almost at the same time, e.g.: you submit a few expenses offline, once you have connection, you resubmit them very close in time. You want to update their status by expense ID, not by focusing them and then updating. I don't think it's worth the effort of maintaining an API hyper-optimized to edit the default expense. The UI should maintain the state of the expense being edited by the user, and the domain should only know about what expenses are updated by ID, kind of like a REST API.

solution: update by ID, UI stores the ID of the expense being edited
