import { noop } from "@c3/utils";
import {
  BaseListItemType,
  Col,
  List,
  RenderItem,
  Row,
} from "@collie-ui/layout";
import React, { useMemo, useState } from "react";
import { anti } from "./util";
import { styled } from "@colliejs/react";

const StyledContentList = styled(List, {
  "&>[data-state='inactive']": { display: "none" },
});

//===========================================================
// BaseTab
//===========================================================
export type TabItemType<T extends BaseListItemType<T>> = {
  id: string | number;
  active: boolean;
  renderItem?: RenderItem<T>;
  renderContent?: RenderItem<T>;
};

export type TabConfig<T extends TabItemType<T>> = T[];

export type TabProps<T extends TabItemType<T>> = {
  direction: "row" | "column";
  data: TabConfig<T>;
  updateData: (config: TabConfig<T>) => void;
  renderItem?: RenderItem<T>;
  renderContent?: RenderItem<T>;
};

export const BaseTabs = <T extends TabItemType<T>>(props: TabProps<T>) => {
  const {
    data,
    updateData,
    direction,
    renderItem,
    renderContent,
    ...restProps
  } = props;
  const Layout = direction === "row" ? Row : Col;
  const nav = useMemo(
    () => (
      <List
        as="co-nav"
        data={data}
        direction={anti(direction)}
        renderItem={(e: T) => e.renderItem?.(e) || renderItem?.(e)}
        updateData={updateData}
      />
    ),
    [data, direction, renderItem, updateData]
  );

  const content = useMemo(() => {
    return (
      <StyledContentList
        data={data}
        direction={anti(direction)}
        renderItem={(e: T) =>
          e.renderContent?.(e) || renderContent?.(e) || <></>
        }
        updateData={noop}
      />
    );
  }, [data, direction, renderContent]);

  return (
    <Layout as="co-tabs" {...restProps}>
      {nav}
      {content}
    </Layout>
  );
};

//===========================================================
// TabControlled
//===========================================================
export type BaseTabControlledProps<T extends TabItemType<T>> = Omit<
  TabProps<T>,
  "updateData" | "data"
> & { initialData: T[] };

export const BaseTabControlled = <T extends TabItemType<T>>(
  props: BaseTabControlledProps<T>
) => {
  const { initialData, ...restProps } = props;
  const [data, setData] = useState(initialData);
  return (
    <BaseTabs data={data} updateData={setData} {...restProps}></BaseTabs>
  );
};