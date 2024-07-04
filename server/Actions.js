// All the events

 const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "conde-change",
  SYNC_CODE: "sync-code",
  LEAVE: "leave",
  COMPILE_JAVA: "compile-java", // New action for compiling Java code
  COMPILE_JS: "compile-js",
  COMPILATION_RESULT: "compilation-result", // New action for receiving compilation result
};

module.exports = ACTIONS;
