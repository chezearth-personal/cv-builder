import { Link } from "react-router-dom";
import 'App.css';

export { ErrorPage };

function ErrorPage() {
  return (
    <div className='App'>
      <h3>
        You've not provided your details. Kindly head back to the{" "}
        <Link to='/'>homepage</Link>.
      </h3>
    </div>
  );
}
