declare class CamlBuilder {
    constructor();
    /** Generate CAML Query, starting from <Where> tag */
    Where(): CamlBuilder.IFieldExpression;
    /** Generate CAML Query, starting from <Query> tag */
    Query(): CamlBuilder.IQuery;
    /** Generate <View> tag for SP.CamlQuery
          @param viewFields If omitted, default view fields are requested; otherwise, only values for the fields with the specified internal names are returned.
                          Specifying view fields is a good practice, as it decreases traffic between server and client.
                          Additionally you can specify aggregated fields, e.g. { count: "<field name>" }, { sum: "<field name>" }, etc.. */
    View(viewFields?: CamlBuilder.ViewField[]): CamlBuilder.IView;
    /** Generate <ViewFields> tag for SPServices */
    ViewFields(viewFields: string[]): CamlBuilder.IFinalizableToString;
    /** Use for:
          1. SPServices CAMLQuery attribute
          2. Creating partial expressions
          3. In conjunction with Any & All clauses
      */
    static Expression(): CamlBuilder.IFieldExpression;
    static FromXml(xml: string): CamlBuilder.IRawQuery;
    static ReuseWhere(xml: string): CamlBuilder.IFieldExpression;
    static ReuseWhereFinal(xml: string): CamlBuilder.IExpression;
    static ReuseExpression(expressions: CamlBuilder.IExpression[]): any;
}
declare module CamlBuilder {
    type Aggregation = {
        count: string;
    } | {
        sum: string;
    } | {
        avg: string;
    } | {
        max: string;
    } | {
        min: string;
    } | {
        stdev: string;
    } | {
        var: string;
    };
    type ViewField = string | Aggregation;
    interface IView extends IFinalizable {
        /** Define query */
        Query(): IQuery;
        /** Define maximum amount of returned records */
        RowLimit(limit: number, paged?: boolean): IView;
        /** Define view scope */
        Scope(scope: ViewScope): IView;
        /** Join the list you're querying with another list.
                Joins are only allowed through a lookup field relation.
                @param lookupFieldInternalName Internal name of the lookup field, that points to the list you're going to join in.
                @alias alias for the joined list */
        InnerJoin(lookupFieldInternalName: string, alias: string): IJoin;
        /** Join the list you're querying with another list.
                Joins are only allowed through a lookup field relation.
                @param lookupFieldInternalName Internal name of the lookup field, that points to the list you're going to join in.
                @alias alias for the joined list */
        LeftJoin(lookupFieldInternalName: string, alias: string): IJoin;
    }
    interface IJoinable {
        /** Join the list you're querying with another list.
                Joins are only allowed through a lookup field relation.
                @param lookupFieldInternalName Internal name of the lookup field, that points to the list you're going to join in.
                @param alias Alias for the joined list
                @param fromList (optional) List where the lookup column resides - use it only for nested joins */
        InnerJoin(lookupFieldInternalName: string, alias: string, fromList?: string): IJoin;
        /** Join the list you're querying with another list.
                Joins are only allowed through a lookup field relation.
                @param lookupFieldInternalName Internal name of the lookup field, that points to the list you're going to join in.
                @param alias Alias for the joined list
                @param fromList (optional) List where the lookup column resides - use it only for nested joins */
        LeftJoin(lookupFieldInternalName: string, alias: string, fromList?: string): IJoin;
    }
    interface IJoin extends IJoinable {
        /** Select projected field for using in the main Query body
                @param remoteFieldAlias By this alias, the field can be used in the main Query body. */
        Select(remoteFieldInternalName: string, remoteFieldAlias: string): IProjectableView;
    }
    interface IProjectableView extends IJoinable {
        /** Define query */
        Query(): IQuery;
        /** Define maximum amount of returned records */
        RowLimit(limit: number, paged?: boolean): IView;
        /** Define view scope */
        Scope(scope: ViewScope): IView;
        /** Select projected field for using in the main Query body
                @param remoteFieldAlias By this alias, the field can be used in the main Query body. */
        Select(remoteFieldInternalName: string, remoteFieldAlias: string): IProjectableView;
    }
    enum ViewScope {
        Recursive = 0,
        RecursiveAll = 1,
        FilesOnly = 2
    }
    interface IQuery extends IGroupable {
        Where(): IFieldExpression;
    }
    interface IFinalizableToString {
        /** Get the resulting CAML query as string */
        ToString(): string;
    }
    interface IFinalizable extends IFinalizableToString {
        /** Get the resulting CAML query as SP.CamlQuery object */
        ToCamlQuery(): any;
    }
    interface ISortable extends IFinalizable {
        /** Adds OrderBy clause to the query
                @param fieldInternalName Internal field of the first field by that the data will be sorted (ascending)
                @param override This is only necessary for large lists. DON'T use it unless you know what it is for!
                @param useIndexForOrderBy This is only necessary for large lists. DON'T use it unless you know what it is for!
            */
        OrderBy(fieldInternalName: string, override?: boolean, useIndexForOrderBy?: boolean): ISortedQuery;
        /** Adds OrderBy clause to the query (using descending order for the first field).
                @param fieldInternalName Internal field of the first field by that the data will be sorted (descending)
                @param override This is only necessary for large lists. DON'T use it unless you know what it is for!
                @param useIndexForOrderBy This is only necessary for large lists. DON'T use it unless you know what it is for!
            */
        OrderByDesc(fieldInternalName: string, override?: boolean, useIndexForOrderBy?: boolean): ISortedQuery;
    }
    interface IGroupable extends ISortable {
        /** Adds GroupBy clause to the query.
                @param collapse If true, only information about the groups is retrieved, otherwise items are also retrieved.
                @param groupLimit Return only first N groups */
        GroupBy(fieldInternalName: any, collapse?: boolean, groupLimit?: number): IGroupedQuery;
    }
    interface IExpression extends IGroupable {
        /** Adds And clause to the query. */
        And(): IFieldExpression;
        /** Adds Or clause to the query. */
        Or(): IFieldExpression;
    }
    interface IGroupedQuery extends ISortable {
    }
    interface ISortedQuery extends IFinalizable {
        /** Specifies next order field (ascending) */
        ThenBy(fieldInternalName: string): ISortedQuery;
        /** Specifies next order field (descending) */
        ThenByDesc(fieldInternalName: string): ISortedQuery;
    }
    interface IFieldExpression {
        /** Adds And clauses to the query. Use for creating bracket-expressions in conjuction with CamlBuilder.Expression(). */
        All(...conditions: IExpression[]): IExpression;
        /** Adds Or clauses to the query. Use for creating bracket-expressions in conjuction with CamlBuilder.Expression(). */
        Any(...conditions: IExpression[]): IExpression;
        /** Adds And clauses to the query. Use for creating bracket-expressions in conjuction with CamlBuilder.Expression(). */
        All(conditions: IExpression[]): IExpression;
        /** Adds Or clauses to the query. Use for creating bracket-expressions in conjuction with CamlBuilder.Expression(). */
        Any(conditions: IExpression[]): IExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Text */
        TextField(internalName: string): ITextFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is ContentTypeId */
        ContentTypeIdField(internalName?: string): ITextFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Choice */
        ChoiceField(internalName: string): ITextFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Computed */
        ComputedField(internalName: string): ITextFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Boolean */
        BooleanField(internalName: string): IBooleanFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is URL */
        UrlField(internalName: string): ITextFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Number */
        NumberField(internalName: string): INumberFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Counter (usually ID fields) */
        CounterField(internalName: string): INumberFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Integer */
        IntegerField(internalName: string): INumberFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is User */
        UserField(internalName: string): IUserFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Lookup */
        LookupField(internalName: string): ILookupFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is LookupMulti */
        LookupMultiField(internalName: string): ILookupMultiFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is UserMulti */
        UserMultiField(internalName: string): IUserMultiFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is Date */
        DateField(internalName: string): IDateTimeFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is DateTime */
        DateTimeField(internalName: string): IDateTimeFieldExpression;
        /** Specifies that a condition will be tested against the field with the specified internal name, and the type of this field is ModStat (moderation status) */
        ModStatField(internalName: string): IModStatFieldExpression;
        /** Used in queries for retrieving recurring calendar events.
                NOTICE: DateRangesOverlap with overlapType other than Now cannot be used with SP.CamlQuery, because it doesn't support
                CalendarDate and ExpandRecurrence query options. Lists.asmx, however, supports them, so you can still use DateRangesOverlap
                with SPServices.
                @param overlapType Defines type of overlap: return all events for a day, for a week, for a month or for a year
                @param calendarDate Defines date that will be used for determining events for which exactly day/week/month/year will be returned.
                                    This value is ignored for overlapType=Now, but for the other overlap types it is mandatory.
                @param eventDateField Internal name of "Start Time" field (default: "EventDate" - all OOTB Calendar lists use this name)
                @param endDateField Internal name of "End Time" field (default: "EndDate" - all OOTB Calendar lists use this name)
                @param recurrenceIDField Internal name of "Recurrence ID" field (default: "RecurrenceID" - all OOTB Calendar lists use this name)
            */
        DateRangesOverlap(overlapType: DateRangesOverlapType, calendarDate: string, eventDateField?: string, endDateField?: string, recurrenceIDField?: string): IExpression;
    }
    interface IBooleanFieldExpression {
        /** Checks whether the value of the field is True */
        IsTrue(): IExpression;
        /** Checks whether the value of the field is False */
        IsFalse(): IExpression;
        /** Checks whether the value of the field is equal to the specified value */
        EqualTo(value: boolean): IExpression;
        /** Checks whether the value of the field is not equal to the specified value */
        NotEqualTo(value: boolean): IExpression;
        /** Checks whether the value of the field was specified by user */
        IsNull(): IExpression;
        /** Checks whether the value of the field was not specified by user */
        IsNotNull(): IExpression;
    }
    interface INumberFieldExpression {
        /** Checks whether the value of the field is equal to the specified value */
        EqualTo(value: number): IExpression;
        /** Checks whether the value of the field is not equal to the specified value */
        NotEqualTo(value: number): IExpression;
        /** Checks whether the value of the field is greater than the specified value */
        GreaterThan(value: number): IExpression;
        /** Checks whether the value of the field is less than the specified value */
        LessThan(value: number): IExpression;
        /** Checks whether the value of the field is greater than or equal to the specified value */
        GreaterThanOrEqualTo(value: number): IExpression;
        /** Checks whether the value of the field is less than or equal to the specified value */
        LessThanOrEqualTo(value: number): IExpression;
        /** Checks whether the value of the field was specified by user */
        IsNull(): IExpression;
        /** Checks whether the value of the field was not specified by user */
        IsNotNull(): IExpression;
        /** Checks whether the value of the field is equal to one of the specified values */
        In(arrayOfValues: number[]): IExpression;
    }
    interface IDateTimeFieldExpression {
        /** Checks whether the value of the field was specified by user */
        IsNull(): IExpression;
        /** Checks whether the value of the field was not specified by user */
        IsNotNull(): IExpression;
        /** Checks whether the value of the field is equal to the specified value */
        EqualTo(value: Date): IExpression;
        /** Checks whether the value of the field is not equal to the specified value */
        NotEqualTo(value: Date): IExpression;
        /** Checks whether the value of the field is greater than the specified value */
        GreaterThan(value: Date): IExpression;
        /** Checks whether the value of the field is less than the specified value */
        LessThan(value: Date): IExpression;
        /** Checks whether the value of the field is greater than or equal to the specified value */
        GreaterThanOrEqualTo(value: Date): IExpression;
        /** Checks whether the value of the field is less than or equal to the specified value */
        LessThanOrEqualTo(value: Date): IExpression;
        /** Checks whether the value of the field is equal to one of the specified values */
        In(arrayOfValues: Date[]): IExpression;
        /** Checks whether the value of the field is equal to the specified value.
                The datetime value should be defined in ISO 8601 format! */
        EqualTo(value: string): IExpression;
        /** Checks whether the value of the field is not equal to the specified value.
                The datetime value should be defined in ISO 8601 format! */
        NotEqualTo(value: string): IExpression;
        /** Checks whether the value of the field is greater than the specified value.
                The datetime value should be defined in ISO 8601 format! */
        GreaterThan(value: string): IExpression;
        /** Checks whether the value of the field is less than the specified value.
                The datetime value should be defined in ISO 8601 format! */
        LessThan(value: string): IExpression;
        /** Checks whether the value of the field is greater than or equal to the specified value.
                The datetime value should be defined in ISO 8601 format! */
        GreaterThanOrEqualTo(value: string): IExpression;
        /** Checks whether the value of the field is less than or equal to the specified value.
                The datetime value should be defined in ISO 8601 format! */
        LessThanOrEqualTo(value: string): IExpression;
        /** Checks whether the value of the field is equal to one of the specified values.
                The datetime value should be defined in ISO 8601 format! */
        In(arrayOfValues: string[]): IExpression;
    }
    interface ITextFieldExpression {
        /** Checks whether the value of the field is equal to the specified value */
        EqualTo(value: string): IExpression;
        /** Checks whether the value of the field is not equal to the specified value */
        NotEqualTo(value: string): IExpression;
        /** Checks whether the value of the field contains the specified substring */
        Contains(value: string): IExpression;
        /** Checks whether the value of the field begins with the specified substring */
        BeginsWith(value: string): IExpression;
        /** Checks whether the value of the field was specified by user */
        IsNull(): IExpression;
        /** Checks whether the value of the field was not specified by user */
        IsNotNull(): IExpression;
        /** Checks whether the value of the field is equal to one of the specified values */
        In(arrayOfValues: string[]): IExpression;
    }
    interface IUserFieldExpression {
        /** Checks whether the value of the User field is equal to id of the current user */
        EqualToCurrentUser(): IExpression;
        /** Checks whether the group specified by the value of the field includes the current user. */
        IsInCurrentUserGroups(): IExpression;
        /** Checks whether the user specified by the value of the field is member of the specified SharePoint Group. */
        IsInSPGroup(groupId: number): IExpression;
        /** Checks whether the user specified by the value of the field is member of current SPWeb groups. */
        IsInSPWebGroups(): IExpression;
        /** Checks whether the user specified by the value of the field is in current SPWeb users. */
        IsInSPWebAllUsers(): IExpression;
        /** Checks whether the user specified by the value of the field has received the rights to the site directly (not through a group). */
        IsInSPWebUsers(): IExpression;
        /** Specifies that id of the user will be used for further comparisons. */
        Id(): INumberFieldExpression;
        /** Specifies that lookup target field value will be used for further comparisons. */
        ValueAsText(): ITextFieldExpression;
    }
    interface ILookupFieldExpression {
        /** Specifies that lookup id value will be used. */
        Id(): INumberFieldExpression;
        /** Specifies that lookup value will be used and this value is of type Text */
        ValueAsText(): ITextFieldExpression;
        /** Specifies that lookup value will be used and this value is of type Number */
        ValueAsNumber(): INumberFieldExpression;
        /** Specifies that lookup value will be used and this value is of type Date */
        ValueAsDate(): IDateTimeFieldExpression;
        /** Specifies that lookup value will be used and this value is of type DateTime */
        ValueAsDateTime(): IDateTimeFieldExpression;
        /** Specifies that lookup value will be used and this value is of type Boolean */
        ValueAsBoolean(): IBooleanFieldExpression;
    }
    interface ILookupMultiFieldExpression {
        /** Checks a condition against every item in the multi lookup value */
        IncludesSuchItemThat(): ILookupFieldExpression;
        /** Checks whether the field values collection is empty */
        IsNull(): IExpression;
        /** Checks whether the field values collection is not empty */
        IsNotNull(): IExpression;
        /** DEPRECATED: use "IncludesSuchItemThat().ValueAsText().EqualTo(value)" instead. */
        Includes(value: any): IExpression;
        /** DEPRECATED: use "IncludesSuchItemThat().ValueAsText().NotEqualTo(value)" instead. */
        NotIncludes(value: any): IExpression;
        /** DEPRECATED: "Eq" operation in CAML works exactly the same as "Includes". To avoid confusion, please use Includes. */
        EqualTo(value: any): IExpression;
        /** DEPRECATED: "Neq" operation in CAML works exactly the same as "NotIncludes". To avoid confusion, please use NotIncludes. */
        NotEqualTo(value: any): IExpression;
    }
    interface IUserMultiFieldExpression {
        /** Checks a condition against every item in the multi lookup value */
        IncludesSuchItemThat(): IUserFieldExpression;
        /** Checks whether the field values collection is empty */
        IsNull(): IExpression;
        /** Checks whether the field values collection is not empty */
        IsNotNull(): IExpression;
        /** DEPRECATED: use "IncludesSuchItemThat().ValueAsText().EqualTo(value)" instead. */
        Includes(value: any): IExpression;
        /** DEPRECATED: use "IncludesSuchItemThat().ValueAsText().NotEqualTo(value)" instead. */
        NotIncludes(value: any): IExpression;
        /** DEPRECATED: "Eq" operation in CAML works exactly the same as "Includes". To avoid confusion, please use Includes. */
        EqualTo(value: any): IExpression;
        /** DEPRECATED: "Neq" operation in CAML works exactly the same as "NotIncludes". To avoid confusion, please use NotIncludes. */
        NotEqualTo(value: any): IExpression;
    }
    interface IModStatFieldExpression {
        /** Represents moderation status ID. */
        ModStatId(): INumberFieldExpression;
        /** Checks whether the value of the field is Approved - same as ModStatId.EqualTo(0) */
        IsApproved(): IExpression;
        /** Checks whether the value of the field is Rejected - same as ModStatId.EqualTo(1) */
        IsRejected(): IExpression;
        /** Checks whether the value of the field is Pending - same as ModStatId.EqualTo(2) */
        IsPending(): IExpression;
        /** Represents moderation status as localized text. In most cases it is better to use ModStatId in the queries instead of ValueAsText. */
        ValueAsText(): ITextFieldExpression;
    }
    interface IRawQuery {
        /** Change Where clause */
        ReplaceWhere(): IFieldExpression;
        ModifyWhere(): IRawQueryModify;
        /**
         * Takes a raw CAML <Query> as string, and update it to a full <View> CAML string object, including ViewFields, and RowLimit
         * Replacing the existing ones if needed.
         * @param rowLimit New RowLimit to apply
         * @param paged Defines if the RowLimit is returning Paged results
         * @param viewFields List of field names to add into the ViewFields section of the query
         */
        OverrideQueryParams(rowLimit: number, paged: boolean, viewFields: any[]): IExpression;
        ReturnReusableWhere(): IFieldExpression;
        ReturnFinalWhere(): IExpression;
    }
    interface IRawQueryModify {
        AppendOr(): IFieldExpression;
        AppendAnd(): IFieldExpression;
    }
    enum DateRangesOverlapType {
        /** Returns events for today */
        Now = 0,
        /** Returns events for one day, specified by CalendarDate in QueryOptions */
        Day = 1,
        /** Returns events for one week, specified by CalendarDate in QueryOptions */
        Week = 2,
        /** Returns events for one month, specified by CalendarDate in QueryOptions.
                Caution: usually also returns few days from previous and next months */
        Month = 3,
        /** Returns events for one year, specified by CalendarDate in QueryOptions */
        Year = 4
    }
    class Internal {
        static createView(viewFields?: ViewField[]): IView;
        static createViewFields(viewFields: string[]): IFinalizableToString;
        static createQuery(): IQuery;
        static createWhere(): IFieldExpression;
        static createExpression(): IFieldExpression;
        static createRawQuery(xml: string): IRawQuery;
    }
    class CamlValues {
        /** Dynamic value that represents Id of the current user */
        static UserID: string;
        /** Dynamic value that represents current date */
        static Today: string;
        /** Dynamic value that represents current date with specified offset (may be negative) */
        static TodayWithOffset(offsetDays: number): string;
        static Now: string;
        /** Dynamic value that represents a property of the current list */
        static ListProperty: {
            /** Date and time the list was created. */
            Created: string;
            /** Server-relative URL of the default list view. */
            DefaultViewUrl: string;
            /** Description of the list. */
            Description: string;
            /** Determines if RSS syndication is enabled for the list */
            EnableSyndication: string;
            /** Number of items in the list */
            ItemCount: string;
            /** Title linked to the list */
            LinkTitle: string;
            /** For a document library that uses version control with major versions only, maximum number of major versions allowed for items. */
            MajorVersionLimit: string;
            /** For a document library that uses version control with both major and minor versions, maximum number of major versions allowed for items. */
            MajorWithMinorVersionsLimit: string;
            /** Site-relative URL for the list. */
            RelativeFolderPath: string;
            /** Title of the list. */
            Title: string;
            /** View selector with links to views for the list. */
            ViewSelector: string;
        };
        /** Dynamic value that represents a property of the current SPWeb */
        static ProjectProperty: {
            /** Category of the current post item. */
            BlogCategoryTitle: string;
            /** Title of the current post item. */
            BlogPostTitle: string;
            /** Represents a description for the current website. */
            Description: string;
            /** Represents a value that determines whether the recycle bin is enabled for the current website. */
            RecycleBinEnabled: string;
            /** User name of the owner for the current site collection. */
            SiteOwnerName: string;
            /** Full URL of the current site collection. */
            SiteUrl: string;
            /** Title of the current Web site. */
            Title: string;
            /** Full URL of the current Web site. */
            Url: string;
        };
    }
}
export = CamlBuilder;
