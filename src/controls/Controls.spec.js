import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import renderer from "react-test-renderer";
import "jest-dom/extend-expect";
import Controls from "./Controls";
import Display from "../display/Display";

afterEach(cleanup);

describe("Controls", () => {
  test("provides button for toggling open/closed", () => {
    const { getByTestId } = render(<Controls />);

    const openButton = getByTestId("openBtn");

    expect(openButton).toBeInTheDocument();
  });

  test("provides button for toggling locked/unlocked", () => {
    const { getByTestId } = render(<Controls />);

    const lockButton = getByTestId("lockBtn");

    expect(lockButton).toBeInTheDocument();
  });

  test('displays "Open Gate" if props.closed === true', () => {
    const { getByText } = render(<Controls closed={true} />);

    const openGate = getByText(/Open Gate/);

    expect(openGate).toBeInTheDocument();
  });

  test('displays "Close Gate" if props.closed === false', () => {
    const { getByText } = render(<Controls closed={false} />);

    const closeGate = getByText(/Close Gate/);

    expect(closeGate).toBeInTheDocument();
  });

  test('displays "Lock Gate" if props.locked === false', () => {
    const { getByText } = render(<Controls locked={false} />);

    const lockGate = getByText(/Lock Gate/);

    expect(lockGate).toBeInTheDocument();
  });

  test('displays "Unlock Gate" if props.locked === true', () => {
    const { getByText } = render(<Controls locked={true} />);

    const unlockGate = getByText(/Unlock Gate/);

    expect(unlockGate).toBeInTheDocument();
  });

  test("disables lock button if gate is open", () => {
    render(<Controls closed={false} />);
    const { getByTestId } = render(<Display closed={false} />);

    const lockButton = getByTestId("lockBtn");
    const openGate = getByTestId("openStatus");

    expect(lockButton).toBeDisabled();
    expect(openGate.textContent).toBe("Open");
  });

  test("disables open button if gate is locked and closed", () => {
    render(<Controls locked={true} closed={true} />);
    const { getByTestId } = render(<Display locked={true} closed={true} />);

    const openButton = getByTestId("openBtn");
    const lockedGate = getByTestId("lockStatus");
    const openGate = getByTestId("openStatus");

    expect(openButton).toBeDisabled();
    expect(openGate.textContent).toBe("Closed");
    expect(lockedGate.textContent).toBe("Locked");
  });

  test("calls toggleLocked (passed as a prop) on button click", () => {
    const toggleLocked = jest.fn();

    const { getByText } = render(
      <Controls toggleLocked={toggleLocked} closed={true} />
    );

    const lockButton = getByText(/lock gate/i);

    fireEvent.click(lockButton);

    expect(toggleLocked).toHaveBeenCalled();
  });

  test("calls toggleClosed passed as a prop on button click", () => {
    const toggleClosed = jest.fn();

    const { getByText } = render(
      <Controls toggleClosed={toggleClosed} locked={false} />
    );

    const openButton = getByText(/(close)|(open)/i);

    fireEvent.click(openButton);

    expect(toggleClosed).toHaveBeenCalled();
  });

  test("matches snapshot", () => {
    const tree = renderer.create(<Controls />);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
