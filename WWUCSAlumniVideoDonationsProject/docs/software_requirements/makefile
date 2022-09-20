#
# Makefile for making srs

TEXFILES= description.tex  glossary.tex models.tex external.tex \
          introduction.tex nonfunction.tex features.tex issues.tex \
          srs.tex


all: srs.pdf

srs.pdf: $(TEXFILES)
	pdflatex srs
	pdflatex srs

clean:
	rm -f *.aux *.log *~

realclean: clean
	rm -f *.pdf

