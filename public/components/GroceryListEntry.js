let GroceryListEntry = () => (
  <div class="groceryListEntry">
    <form>
      <input type="text" name="groceryItem" placeholder="item"></input>
      <input type="text" name="quantity" placeholder="Quantity"></input>
    </form>
  </div>
);

window.GroceryListEntry = GroceryListEntry;