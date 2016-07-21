var StarRatingComponent = ({onStarClick}) => (
	<div className="star-rating col-sm-10">
	  <input type="radio" name="rating" value="1" onChange={onStarClick}/><i></i>
	  <input type="radio" name="rating" value="2" onChange={onStarClick}/><i></i>
	  <input type="radio" name="rating" value="3" onChange={onStarClick}/><i></i>
	  <input type="radio" name="rating" value="4" onChange={onStarClick}/><i></i>
	  <input type="radio" name="rating" value="5" onChange={onStarClick}/><i></i>
	</div>
)

window.StarRatingComponent = StarRatingComponent;