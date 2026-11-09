/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * OPAR Layout Containers & Grids
 */

import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide' | 'full';
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  as: Component = 'div',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',     // ~896px for editorial reading & text
    default: 'max-w-6xl',    // ~1152px standard content container
    wide: 'max-w-[1440px]',  // ~1440px standard desktop baseline
    full: 'w-full'
  }[size];

  return (
    <Component
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = 'lg',
  as: Component = 'div',
  className = '',
  ...props
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }[cols];

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8 md:gap-10',
    xl: 'gap-10 md:gap-16'
  }[gap];

  return (
    <Component className={`grid ${colClasses} ${gapClasses} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Container;
