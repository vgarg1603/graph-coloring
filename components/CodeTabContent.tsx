'use client'
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import {Highlight, themes} from "prism-react-renderer";

const codeCpp = `// C++ Graph Coloring using Backtracking
bool isSafe(int v, vector<vector<int>>& graph, vector<int>& color, int c) {
    for (int i = 0; i < graph.size(); i++)
        if (graph[v][i] && color[i] == c)
            return false;
    return true;
}

bool graphColoringUtil(vector<vector<int>>& graph, int m, vector<int>& color, int v) {
    if (v == graph.size()) return true;

    for (int c = 1; c <= m; c++) {
        if (isSafe(v, graph, color, c)) {
            color[v] = c;
            if (graphColoringUtil(graph, m, color, v + 1)) return true;
            color[v] = 0;
        }
    }
    return false;
}
`;

const codeJs = `// JavaScript Graph Coloring using Backtracking
function isSafe(v, graph, color, c) {
    for (let i = 0; i < graph.length; i++) {
        if (graph[v][i] && color[i] === c) return false;
    }
    return true;
}

function graphColoringUtil(graph, m, color, v) {
    if (v === graph.length) return true;

    for (let c = 1; c <= m; c++) {
        if (isSafe(v, graph, color, c)) {
            color[v] = c;
            if (graphColoringUtil(graph, m, color, v + 1)) return true;
            color[v] = 0;
        }
    }
    return false;
}
`;

export default function CodeTabContent() {
  const [lang, setLang] = useState<"cpp" | "js">("cpp");
  const currentCode = lang === "cpp" ? codeCpp : codeJs;
  const langName = lang === "cpp" ? "cpp" : "javascript";

  return (
    <TabsContent value="code" className="space-y-4">
      <div className="flex justify-end">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "cpp" | "js")}
          className="border p-1 rounded-md mt-2"
        >
          <option className="bg-black" value="cpp">C++</option>
          <option className="bg-black" value="js">JavaScript</option>
        </select>
      </div>

      <Highlight theme={themes.vsDark} code={currentCode} language={langName}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 rounded-md overflow-auto`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </TabsContent>
  );
}
