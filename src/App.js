import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [isResponse, setIsResponse] = useState(false);
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");

  const handleTextareaChange = (event) => {
    setMessage(event.target.value);
  };

  const getAnswer = async (message) => {
    setResponse("");
    setIsResponse(false);
    console.log("hello");

    try {
      const OPENAI_API_KEY =
        "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";

      const system = { role: "system", content: message };

      const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [system],
          temperature: 0.8,
          stream: true,
        }),
      });

      // const reader = res.body.getReader();
      // const decoder = new TextDecoder();
      // let done = false;
      // let code = "";

      // while (!done) {
      //   const { value, done: doneReading } = await reader.read();
      //   done = doneReading;
      //   const chunkValue = decoder.decode(value);

      //   code += chunkValue;
      //   console.log(code);
      // }

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let code = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          // console.log("yumjyu", value);
          const chunkValue = decoder.decode(value);

          console.log("dfgvdfgvdfs", chunkValue);

          const jsonObjects = chunkValue.trim().split("data: ");

          // console.log("sssssssssss", jsonObjects);
          for (const jsonObjectString of jsonObjects) {
            try {
              const jsonStartIndex = jsonObjectString.indexOf("{");
              const editedObject = jsonObjectString.slice(jsonStartIndex);
              // console.log("kkkkkkkkkdddddddddd", editedObject);

              if (editedObject.length > 1) {
                const jsonObject = JSON.parse(editedObject);
                // console.log("11111111", jsonObject);
                jsonObject.choices[0].delta.content &&
                  setResponse(
                    (response) => response + jsonObject.choices[0].delta.content
                  );
                setIsResponse(true);
                // console.log("nnnnnnnn", jsonObject.choices[0].delta.content);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
          console.log("sfgdfghgfhtrtrgtrgrt", response);
          // console.log("11111111", chunkValue);
          // console.log("3333333333", typeof chunkValue);
          // console.log("444444444444", JSON.stringify(chunkValue));
          // console.log("55555555555", typeof JSON.stringify(chunkValue));
          // console.log("66666666", JSON.parse(JSON.stringify(chunkValue)));
          // console.log("8888888", typeof JSON.parse(JSON.stringify(chunkValue)));

          // console.log("6777777777766", typeof JSON.parse(chunkValue));
          // // console.log(typeof chunkValue);
          // const jsonStartIndex = chunkValue.indexOf("{");
          // const editedChunk = chunkValue.slice(jsonStartIndex);
          // console.log("212121212", editedChunk);
          // console.log("434334434", typeof editedChunk);
          // const jsonChunk = JSON.parse(editedChunk);
          // const jsonRegex = /{.*}/s; // Regular expression to match the JSON part

          // const matchedChunk = chunkValue.match(jsonRegex);
          // console.log("435435345543", `2204${matchedChunk[0]}2204`);
          // console.log("411111111135435345543", matchedChunk[0].length);

          // console.log("6786786787", typeof matchedChunk[0]);

          // const jsonstring = `{"id":"chatcmpl-7gAULDF1nl97KwvW2rXcQbChtmwhT","object":"chat.completion.chunk","created":1690284449,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}`;

          // const problematicPosition = 219;
          // console.log(
          //   jsonstring.substring(
          //     problematicPosition - 10,
          //     problematicPosition + 10
          //   )
          // );

          // console.log(
          //   jsonstring.substring(
          //     problematicPosition - 10,
          //     problematicPosition + 10
          //   ).length
          // );

          // const jsonObject = JSON.parse(matchedChunk[0]);
          // console.log("mmmmmmmmmmmmm", jsonObject);

          // var chunkObject = JSON.stringify(matchedChunk[0]);
          // chunkObject = JSON.parse(chunkObject);
          // console.log("gggggggSDfdsafdsa", chunkObject);
          // console.log(typeof chunkObject);
          // code += chunkValue;
          // setIsResponse(true);
          // setResponse((response) => response + chunkValue);
        }

        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }

    // const data = await axios.post("http://localhost:4000/api", {
    //   message: message,
    // });
  };

  return (
    <div className="App">
      <div className="textareacontainer" style={{ margin: "0 auto" }}>
        <p style={{ marginTop: "100px" }}>Ask anything</p>
        <textarea
          style={{ width: "300px", height: "150px" }}
          value={message} // Set the value of the textarea to the state value
          onChange={handleTextareaChange} // Attach the onChange event handler
          placeholder="Type your text here..."
        />
        <button
          onClick={() => getAnswer(message)}
          style={{ position: "relative", right: "60px", bottom: "15px" }}
        >
          Enter
        </button>
      </div>

      <div
        style={{
          textAlign: "left",
          margin: "0 auto",
          width: "50%",
        }}
      >
        <pre style={{ whiteSpace: "pre-wrap" }}>
          <code>{isResponse ? response : null}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;
