import React, { useEffect, useRef, useState } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../Actions";
import axios from "axios";

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  const [output, setOutput] = useState(""); // State to hold compilation output
   const [language, setLanguage] = useState("");
  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "text/x-java", json: true }, // Set mode to Java
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current = editor;

      editor.setSize(null, "100%");
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, []);

  // Handle receiving code from server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  // Function to send Java code to backend for compilation
  const compileJavaCode = () => {
    if(language=="java"){
    const code = editorRef.current.getValue();
    console.log("Code to be compiled:", code);

    socketRef.current.emit(ACTIONS.COMPILE_JAVA, { roomId, code });
 }else if(language=="javascript"){
   const code = editorRef.current.getValue();
    console.log("Code to be compiled:", code);

    socketRef.current.emit(ACTIONS.COMPILE_JS, { roomId, code });
 }
  };

  const handledrop=(e)=>{
    if(e.target.value=="java"){
      setLanguage("java")
    }else{
      setLanguage("javascript")
    }
  }
  // Handle receiving compilation result from server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.COMPILATION_RESULT, ({ output }) => {
        console.log("Iside useEffect "+output)
        setOutput(output);
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.COMPILATION_RESULT);
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "600px" }}>
      <div>
        <button onClick={compileJavaCode}>Compile Java</button>
        <select onClick={handledrop}>
          <option value="java">java</option>
          <option value="javascript">javascript</option>
        </select>
      </div>
      <textarea id="realtimeEditor"></textarea>
      <div>
        <h3>Compilation Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default Editor;
