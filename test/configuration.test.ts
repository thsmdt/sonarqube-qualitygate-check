import { assertThrows } from "https://deno.land/std@0.218.2/assert/mod.ts";
import { ConfigurationFromCli } from "../src/configuration.ts";
import { assertEquals } from "https://deno.land/std@0.218.2/assert/assert_equals.ts";

Deno.test("ConfigurationFromCli - All arguments provided.", () => {
  const args = [
    "--token=xyz456",
    "--hostUrl=http://example.com",
    "--taskFile=task.txt",
    "--analysisTimeout=300",
  ];
  const config = new ConfigurationFromCli(args);

  assertEquals(config.token, "xyz456");
  assertEquals(config.hostUrl.toString(), "http://example.com/");
  assertEquals(config.taskFile, "task.txt");
  assertEquals(config.analysisTimeout, 300);
});

Deno.test("ConfigurationFromCli - hostUrl not a valid URL", () => {
  const args = [
    "--token=xyz456",
    "--hostUrl=Penguin",
    "--taskFile=task.txt",
    "--analysisTimeout=300",
  ];
  assertThrows(() => new ConfigurationFromCli(args));
});

Deno.test("ConfigurationFromCli - Missing token", () => {
  const args = [
    "--hostUrl=http://example.com",
    "--taskFile=task.txt",
    "--analysisTimeout=300",
  ];
  assertThrows(() => new ConfigurationFromCli(args));
});

Deno.test("ConfigurationFromCli - Missing hostUrl", () => {
  const args = [
    "--token=xyz456",
    "--taskFile=task.txt",
    "--analysisTimeout=300",
  ];
  assertThrows(() => new ConfigurationFromCli(args));
});

Deno.test("ConfigurationFromCli - Missing taskFile", () => {
  const args = [
    "--token=xyz456",
    "--hostUrl=http://example.com",
    "--analysisTimeout=300",
  ];
  assertThrows(() => new ConfigurationFromCli(args));
});

Deno.test("ConfigurationFromCli - Missing analysisTimeout", () => {
  const args = ["--token=xyz456", "--hostUrl=Penguin", "--taskFile=task.txt"];
  assertThrows(() => new ConfigurationFromCli(args));
});
