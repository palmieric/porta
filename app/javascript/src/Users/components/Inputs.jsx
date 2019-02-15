// @flow

import * as React from 'react'

type Props = {
  name: string,
  children?: React.Node
}

const Inputs = ({ name, children }: Props) => (
  <fieldset className='inputs' name={name}>
    <legend><span>{name}</span></legend>
    <ol>{children}</ol>
  </fieldset>
)

export { Inputs }
