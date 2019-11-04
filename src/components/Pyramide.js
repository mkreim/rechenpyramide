import React, { useMemo } from 'react';
import styled from 'styled-components';
import useForm from 'react-hook-form';

/*
        x
       x x
      x x x
     x x x x
    x x x x x
*/
const rowCount = 5;
const minValue = 0;
const maxValue = 10;

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function initializePyramid() {
  const result = [];

  for (let rowIdx = rowCount; rowIdx >= 0; rowIdx -= 1) {
    const rowLength = rowIdx;
    const newRow = [];
    for (let colIdx = 0; colIdx <= rowLength; colIdx += 1) {
      if (rowIdx === rowCount) {
        newRow.push(getRandomInt(minValue, maxValue));
      } else {
        newRow.push(result[0][colIdx] + result[0][colIdx + 1]);
      }
    }
    result.unshift(newRow);
  }
  return result;
}

const PyramidInput = styled.input`
  width: 2em;
  text-align: center;
  font-size: x-large;
  background: ${props => props.color};
`;

const colorEmpty = '#ffffff';
const colorWrong = '#ff0000';
const colorRight = '#00ff00';

function PyramidCell({ number, colIdx, rowIdx, errors, getValues, register }) {
  const name = useMemo(() => `${rowIdx};${colIdx}`, [rowIdx, colIdx]);
  const currentValue = useMemo(() => {
    const values = getValues();
    return values[name];
  }, [getValues, name]);

  const isWrong = useMemo(() => errors && errors[name], [errors, name]);

  const color = useMemo(() => {
    if (!currentValue) {
      return colorEmpty;
    }
    if (isWrong) {
      return colorWrong;
    }
    return colorRight;
  }, [currentValue, isWrong]);

  return (
    <PyramidInput
      defaultValue={rowIdx === rowCount ? number : null}
      color={color}
      ref={register({
        validate: value => parseInt(value, 10) === number,
      })}
      name={name}
    />
  );
}

function PyramidRow({ row, register, rowIdx, errors, getValues }) {
  return (
    <div>
      {row.map((number, colIdx) => {
        return (
          <PyramidCell
            number={number}
            colIdx={colIdx}
            rowIdx={rowIdx}
            errors={errors}
            getValues={getValues}
            register={register}
          />
        );
      })}
    </div>
  );
}

function Pyramid() {
  const { register, handleSubmit, errors, getValues, triggerValidation } = useForm();
  const onSubmit = data => {
    console.log(data);
  };
  const pyramid = useMemo(() => initializePyramid(), []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={async () => {
        await triggerValidation();
      }}
    >
      {pyramid.map((row, rowIdx) => (
        <PyramidRow
          row={row}
          register={register}
          rowIdx={rowIdx}
          key={rowIdx}
          errors={errors}
          getValues={getValues}
        />
      ))}
    </form>
  );
}

export default React.memo(Pyramid);
