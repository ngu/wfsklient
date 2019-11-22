<?xml version="1.0" encoding="UTF-8"?>

<!-- Conversion of WFS GetFeature response into JSON format -->
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:fo="http://www.w3.org/1999/XSL/Format"
 xmlns:wfs="http://www.opengis.net/wfs">
	<xsl:output method="text" encoding="UTF-8"/>
	<xsl:template match="*">

		<xsl:param name="recursionCnt">0</xsl:param>
		<xsl:param name="inArray">0</xsl:param>

		<!-- the very first object brace -->
		<xsl:if test="$recursionCnt = 0">{</xsl:if>

		<!-- prepare data from text() area of an object -->
		<xsl:variable name="elementDataType">
			<xsl:value-of select="number(text())"/>
		</xsl:variable>
		<xsl:variable name="elementData">
			<!-- TEXT ( use quotes ) -->
			<xsl:if test="string($elementDataType) ='NaN'">
				<xsl:variable name="tmp" select="normalize-space(text())"/>
				<xsl:if test="$tmp != ''">
					<xsl:text>"</xsl:text>
					<xsl:value-of select="text()"/>
					<xsl:text>"</xsl:text>
				</xsl:if>
			</xsl:if>
			<!-- NUMBER (no quotes ) -->
			<xsl:if test="string($elementDataType) !='NaN'">
				<xsl:value-of select="text()"/>
			</xsl:if>
			<!-- NULL -->
			<xsl:if test="not(*)">
				<xsl:if test="not(text())">
					<xsl:text>null</xsl:text>
				</xsl:if>
			</xsl:if>
		</xsl:variable>

		<!-- atribute and child count -->
		<xsl:variable name="numOfAttribs" select="count(@*)"/>
		<xsl:variable name="numOfChilds" select="count(*)"/>

		<!-- check for child array -->
		<xsl:variable name="hasRepeatElements">
			<xsl:for-each select="*">
				<xsl:if test="name() = name(preceding-sibling::*) or name() = name(following-sibling::*)">
					<xsl:if test="position() = 1">
						<xsl:value-of select="translate(name(),':','_')"/>
					</xsl:if>
				</xsl:if>
			</xsl:for-each>
		</xsl:variable>

		<!-- tagname and opening object brace -->
		<xsl:if test="$inArray != 'true'">
			<xsl:text>"</xsl:text>
			<xsl:value-of select="translate(name(),':','_')"/>
			<xsl:text>": </xsl:text>
		</xsl:if>
		<xsl:text> { </xsl:text>

		<!-- write attributes -->
		<xsl:for-each select="@*">
			<xsl:if test="position() != 1">, </xsl:if>
			<!-- Wert aufbereiten  -->
			<xsl:variable name="dataType">
				<xsl:value-of select="number(.)"/>
			</xsl:variable>
			<xsl:variable name="data">
				<!-- TEXT ( use quotes ) -->
				<xsl:if test="string($dataType) ='NaN'">
					<xsl:text>"</xsl:text>
					<xsl:value-of select="current()"/>
					<xsl:text>"</xsl:text>
				</xsl:if>
				<!-- NUMBER (no quotes ) -->
				<xsl:if test="string($dataType) !='NaN'">
					<xsl:value-of select="current()"/>
				</xsl:if>
			</xsl:variable>
			<xsl:text>"</xsl:text>
			<xsl:value-of select="translate(name(),':','_')"/>
			<xsl:text>": </xsl:text>
			<xsl:value-of select="$data"/>
		</xsl:for-each>

		<!-- write text() area -->
		<xsl:if test="$elementData != ''">
			<xsl:if test="$numOfAttribs != 0">, </xsl:if>
			<xsl:text>"content": </xsl:text>
			<xsl:value-of select="$elementData"/>
		</xsl:if>

		<!-- write childs (as normal tags or as array) -->
		<xsl:if test="$numOfChilds != 0 and ( $numOfAttribs != 0 or $elementData != '' )">, </xsl:if>
		<xsl:if test="$hasRepeatElements != ''">
			<xsl:text>"</xsl:text>
			<xsl:value-of select="$hasRepeatElements"/>
			<xsl:text>": [</xsl:text>
		</xsl:if>

		<xsl:for-each select="*">
			<xsl:if test="position() != 1">, </xsl:if>
			<xsl:apply-templates select="current()">
				<xsl:with-param name="recursionCnt" select="$recursionCnt+1"/>
				<xsl:with-param name="inArray" select="$hasRepeatElements != ''"/>
			</xsl:apply-templates>
		</xsl:for-each>

		<xsl:if test="$hasRepeatElements != ''">
			<xsl:text>]</xsl:text>
		</xsl:if>

		<!-- closing object brace -->
		<xsl:text> } </xsl:text>

		<!-- the very last closing object brace -->
		<xsl:if test="$recursionCnt=0"> }</xsl:if>
	</xsl:template>
</xsl:stylesheet>