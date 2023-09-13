import "@testing-library/jest-dom";

function disableConsoleError() {
  const consoleMock = jest.spyOn(console, "error");
  consoleMock.mockImplementation(() => undefined);
  return consoleMock;
}

disableConsoleError();
