## Decision Table

This is a decision table. It consist of columns that describes API request structure, rows that describe decision-making logic, and cells that represents a single validation rule.

### Columns

Column represent specific request parameter. You can add additional parameters on a fly by adding a column. After saving table with new column all future API request should provide data for it. 

However, API consumer can provide more data and you don't need to specify column for each of request fields, in this case we will skip unused ones.

Column can have following settings:

- ```Title``` - human-readable string that describes field in interface.
- ```Field API Key``` - field name from witch data will be taken. For eg. if you add field with key ```name``` than all API consumers should provide JSON with this field: ```{"name": "Some User Name"}```.
- ```Type``` - type of data that will be submitted in this field. ```String```, ```Number```, ```Boolean``` or special type ```Preset```.

You can modify field value for table rows by adding field preset. For example, you have field called salary and it's too routine to add a "salaries greater than 1000" condition in each row, instead you can create preset that turns ```Numeric``` salary into ```Boolean``` type and simply turn on this validation in each row.

It should look something like this:

- ```Title``` = ```Sufficient Salary```;
- ```Field API Key``` = ```salary```;
- ```Type``` = ```Preset```;
- ```Preset Condition``` = ```greater than```;
- ```Preset Value``` = ```1000```.

By checking checkbox below ```Low Salary```  column in a row, you will make sure that this row won't pass check untill ```salary``` is greater than ```1000```.

### Row

Each row represents a rule in a ```OR``` logical operator style. We will validate all the rules in each cell and pick the highest row with all passed validations to make a final decision.

Rules are checked in a same order as you see them in a table. You can reorder them by drug'n'drop.

### Cells

All cells in a row represent validations in a ```AND``` logical operator style. We will return row final decision only when all columns will pass the validations.

Cells with a "skip" rule will always pass the check.

### Default Decision

It there are no rows with all validations passed, we will return ```final_decision``` that equals a ```Default Decision``` value.

### Sample CURL Request

You can request current decision table by calling this command from your CLI (works on Linux and Mac):
