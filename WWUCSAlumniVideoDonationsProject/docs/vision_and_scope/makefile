#
# Makefile for making vision_and_scope.pdf

TEXFILES=background.tex business_context.tex deliverables.tex \
         schedule.tex scope_limitations.tex vision_and_scope.tex 

all: vision_and_scope.pdf

vision_and_scope.pdf: $(TEXFILES)
	pdflatex vision_and_scope
	pdflatex vision_and_scope

clean:
	rm -f *.aux *.log *~

realclean: clean
	rm -f *.pdf

