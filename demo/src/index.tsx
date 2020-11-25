import React from "react";
import { render } from "react-dom";
import "./index.css";

import FullStoryExcluder, { useFullStoryExcluder } from "../../src";

const Demo = () => {
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [ignoreCase, setIgnoreCase] = React.useState(true);

  const { setExclusionStrings } = useFullStoryExcluder();

  React.useEffect(() => {
    setExclusionStrings([name], { ignoreCase });
  }, [setExclusionStrings, name, ignoreCase]);

  return (
    <div className="App">
      <header>Header</header>
      <main>
        <form>
          <label>
            <span>Name</span>
            <input
              value={name}
              onChange={({ target: { value } }) => setName(value)}
            />
            <output>Name: {name}</output>
          </label>
          <label>
            <span>Age</span>
            <input
              type="number"
              value={age}
              onChange={({ target: { value } }) => setAge(value)}
            />
            <output>Age: {age}</output>
          </label>
          <label>
            <span>Bio</span>
            <textarea
              value={bio}
              onChange={({ target: { value } }) => setBio(value)}
            />
            <output>Bio: {bio}</output>
          </label>
        </form>
      </main>
      <footer>Footer</footer>
      <fieldset>
        <legend>Options</legend>
        <label>
          <span>Ignore case?</span>
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={({ target: { checked } }) => setIgnoreCase(checked)}
          />
        </label>
      </fieldset>
    </div>
  );
};

render(
  <React.StrictMode>
    <FullStoryExcluder htmlFormElements="freeform">
      {() => (
        <div>
          <h1>react-fullstory-excluder Demo</h1>
          <Demo />
        </div>
      )}
    </FullStoryExcluder>
  </React.StrictMode>,
  document.querySelector("#demo")
);
