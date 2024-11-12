/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	and,
	asc,
	count,
	desc,
	eq,
	like,
	getTableColumns,
	getOrderByOperators,
	getTableName,
	getOperators,
	SQL,
	type AnyColumn,
	sql
} from 'drizzle-orm';
import {
	PgTable,
	getTableConfig,
	type PgSelect,
	type PgColumn,
	integer
} from 'drizzle-orm/pg-core';

export function getSQLiteColumn<T extends PgTable>(
	table: T,
	column_name: string
) {
	const { columns } = getTableConfig(table);
	const column = columns.find((c) => c.name == column_name);
	return column;
}

export function withPagination<T extends PgSelect>(
	qb: T,
	page: number = 1,
	pageSize: number = 15
) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export function getOrderBy(column: AnyColumn, order?: string) {
	return order === 'asc' ? asc(column) : desc(column);
}

export function withOrderBy<T extends PgSelect>(
	qb: T,
	column?: AnyColumn,
	order?: string | 'asc' | 'desc'
) {
	if (column) {
		return qb.orderBy(getOrderBy(column, order));
	}
	return qb;
}

// LENGHT OPERATORS
export function lenlt(column: AnyColumn, value: number) {
	return sql`length(${column}) < ${value}`;
}
export function lenlte(column: AnyColumn, value: number) {
	return sql`length(${column}) <= ${value}`;
}
export function leneq(column: AnyColumn, value: number) {
	return sql`length(${column}) = ${value}`;
}
export function lenne(column: AnyColumn, value: number) {
	return sql`length(${column}) != ${value}`;
}
