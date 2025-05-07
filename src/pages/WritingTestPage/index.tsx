import { Box } from "@mui/material";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-dark.min.css";
import javascript from "highlight.js/lib/languages/javascript";
import { useEffect } from "react";
import exampleCode from "/example.testplane.ts?url";

const code = `describe("github", async function () {
    it("should find testplane", async function ({ browser }) {
        await browser.url("https://github.com/gemini-testing/testplane");
        const elem = await browser.$("#readme h1");

        await expect(elem).toHaveText("Testplane");
    });
});`;

hljs.registerLanguage("javascript", javascript);

const WritingTestPage = () => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <Box maxWidth="1280px" m="64px 20px 0 20px">
      <p>
        В основе тестирующей системы лежит{" "}
        <a href="https://testplane.io/ru/" target="_blank">
          Testplane
        </a>
        . В систему необходимо загрузить файл вида{" "}
        <a
          href={exampleCode}
          target="_blank"
          download="example.testplate.ts"
          rel="noopener noreferrer"
        >
          example.testplate.ts
        </a>
        , в котором описаны <code>describe</code> и <code>it</code> блоки,
        аналогичные тем, что используются в Mocha или Jest. Например:
        <pre>
          <code>{code}</code>
        </pre>
      </p>
      <p>
        На данный момент система умеет тестировать только веб-приложения, в
        которых есть входной файл index.html. Это означает, что если участник
        загрузит не архив, а отдельный файл с кодом на JavaScript, то тест не
        будет запущен.
      </p>
      <p>
        В примере можно увидеть, что открывается страница{" "}
        <a href="https://github.com/gemini-testing/testplane" target="_blank">
          https://github.com/gemini-testing/testplane
        </a>
        . При написании теста не нужно указывать путь к решению участника,
        система автоматически открывает решение перед запуском теста.
      </p>
      <p>
        Более подробную информацию о том, как писать автоматические тесты, можно
        найти в документации{" "}
        <a
          href="https://testplane.io/ru/docs/v8/commands/overview/"
          target="_blank"
        >
          Testplane
        </a>
        .
      </p>
    </Box>
  );
};

export default WritingTestPage;
